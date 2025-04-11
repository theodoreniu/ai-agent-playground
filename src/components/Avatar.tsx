import React, { useCallback, useEffect, useRef } from 'react';
import { useContexts } from '../providers/AppProvider';
import * as SpeechSDK from 'microsoft-cognitiveservices-speech-sdk';
import { htmlEncodeAvatar } from '../lib/helper';
import { AVATAR_OFF, AVATAR_READY, AVATAR_STARTING } from '../lib/const';
import { componentLoadingStyles } from '../styles/componentLoadingStyles';
import { Profiles } from '../lib/Profiles';
import { getAgentAvatarToken } from '../lib/agentApi';

const Avatar: React.FC = () => {
  const {
    avatarStatus,
    setAvatarStatus,
    needSpeechQueue,
    setNeedSpeechQueue,
    setCaptionQueue,
    addCaptionQueue,
    updateCaptionQueue,
    replaceInstructions,
    setIsAvatarSpeaking,
    isAvatarSpeaking,
    isNightMode,
  } = useContexts();

  const avatarSynthesizerRef = useRef<any>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const avatarVideoRef = useRef<HTMLVideoElement>(null);
  const avatarAudioRef = useRef<HTMLAudioElement>(null);
  const componentLoading = componentLoadingStyles({ isNightMode });
  const profile = new Profiles().currentProfile;

  useEffect(() => {
    if (avatarStatus === AVATAR_STARTING) {
      startAvatarSession();
    }

    if (avatarStatus === AVATAR_OFF) {
      setCaptionQueue([]);
      stopAvatarSession();
      replaceInstructions(
        '你的虚拟人形象处于打开状态',
        '你的虚拟人形象处于关闭状态',
      );
    }

    if (avatarStatus === AVATAR_READY) {
      replaceInstructions(
        '你的虚拟人形象处于关闭状态',
        '你的虚拟人形象处于打开状态',
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [avatarStatus]);

  useEffect(() => {
    if (avatarStatus !== AVATAR_READY) {
      return;
    }

    if (needSpeechQueue.length === 0) {
      return;
    }

    speakAvatar(needSpeechQueue[0]);
    setNeedSpeechQueue(needSpeechQueue.slice(1));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [needSpeechQueue]);

  useEffect(() => {
    if (!isAvatarSpeaking) {
      stopAvatarSpeaking();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAvatarSpeaking]);

  const startAvatarSession = useCallback(async () => {
    try {
      setAvatarStatus(AVATAR_STARTING);
      console.log('starting avatar session...');

      const speechSynthesisConfig = SpeechSDK.SpeechConfig.fromEndpoint(
        new URL(profile.getAgentAvatarUrl()),
        (profile.useAgentProxy ? profile.agentApiKey : profile.avatarSubKey) ||
          '',
      );

      const videoFormat = new SpeechSDK.AvatarVideoFormat();
      videoFormat.setCropRange(
        new SpeechSDK.Coordinate(600, 0),
        new SpeechSDK.Coordinate(1360, 520),
      );
      console.log('videoFormat: ' + JSON.stringify(videoFormat));

      const avatarConfig = new SpeechSDK.AvatarConfig(
        'harry',
        'business',
        videoFormat,
      );
      console.log('avatarConfig: ' + JSON.stringify(avatarConfig));
      avatarConfig.customized = false;
      avatarConfig.backgroundImage = new URL(
        'https://playground.azuretsp.com/images/bg_dark.jpg',
      );

      let responseData = null;

      if (profile.useAgentProxy) {
        responseData = await getAgentAvatarToken();
      } else {
        const response = await fetch(
          `https://${profile.avatarRegion}.tts.speech.microsoft.com/cognitiveservices/avatar/relay/token/v1`,
          {
            headers: {
              'Ocp-Apim-Subscription-Key': profile.avatarSubKey,
            },
          },
        );
        responseData = await response.json();
      }

      console.log(responseData);

      avatarSynthesizerRef.current = new SpeechSDK.AvatarSynthesizer(
        speechSynthesisConfig,
        avatarConfig,
      );

      await setupWebRTCAvatar(
        responseData.Urls[0],
        responseData.Username,
        responseData.Password,
      );

      console.log(
        'avatarSynthesizerRef.current: ' + avatarSynthesizerRef.current,
      );
    } catch (error) {
      console.log(error);
      alert(
        `Avatar session failed to start. Please check your configuration or network.\n` +
          error,
      );
      setAvatarStatus(AVATAR_OFF);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setupWebRTCAvatar = async (
    iceServerUrl: string,
    iceServerUsername: string,
    iceServerCredential: string,
  ) => {
    const useTcpForWebRTC = false;

    peerConnectionRef.current = new RTCPeerConnection({
      iceServers: [
        {
          urls: [
            useTcpForWebRTC
              ? iceServerUrl.replace(':3478', ':443?transport=tcp')
              : iceServerUrl,
          ],
          username: iceServerUsername,
          credential: iceServerCredential,
        },
      ],
      iceTransportPolicy: useTcpForWebRTC ? 'relay' : 'all',
    });

    peerConnectionRef.current.ontrack = (event) => {
      const video = avatarVideoRef.current;
      const audio = avatarAudioRef.current;

      if (!video || !audio) {
        console.error('avatarVideoRef or avatarAudioRef is not initialized');
        return;
      }

      console.log(event);

      if (event.track.kind === 'video') {
        video.id = 'avatarVideo';
        video.srcObject = event.streams[0];
        video.autoplay = true;
      } else if (event.track.kind === 'audio') {
        audio.id = 'avatarAudio';
        audio.srcObject = event.streams[0];
        audio.autoplay = true;
      }

      video.onloadedmetadata = () => {
        setAvatarStatus(AVATAR_READY);
      };
    };

    // Add transceivers
    peerConnectionRef.current.addTransceiver('video', {
      direction: 'sendrecv',
    });
    peerConnectionRef.current.addTransceiver('audio', {
      direction: 'sendrecv',
    });

    // Start avatar
    console.log('starting avatar...');
    if (!avatarSynthesizerRef.current) return;
    const result = await avatarSynthesizerRef.current.startAvatarAsync(
      peerConnectionRef.current,
    );
    if (result.reason === SpeechSDK.ResultReason.SynthesizingAudioCompleted) {
      console.log('Avatar started successfully');
    } else {
      throw new Error(JSON.stringify(result));
    }
  };

  const stopAvatarSession = () => {
    console.log('stopping avatar session...');
    setIsAvatarSpeaking(false);

    avatarSynthesizerRef.current?.close();

    if (avatarVideoRef.current) {
      avatarVideoRef.current.srcObject = null;
    }
    if (avatarAudioRef.current) {
      avatarAudioRef.current.srcObject = null;
    }
  };

  const toggleAvatar = () => {
    if (avatarStatus === AVATAR_OFF) {
      setAvatarStatus(AVATAR_STARTING);
    } else {
      setAvatarStatus(AVATAR_OFF);
    }
  };

  const speakAvatar = async (spokenText: string) => {
    if (!avatarSynthesizerRef.current) return;

    try {
      console.log(`speaking avatar: ${spokenText}`);
      addCaptionQueue(spokenText);

      setIsAvatarSpeaking(true);
      const ttsVoice = 'en-US-AndrewMultilingualNeural';
      const spokenSsml = `
          <speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xmlns:mstts='http://www.w3.org/2001/mstts' xml:lang='en-US'>
            <voice name='${ttsVoice}'>
              <mstts:leadingsilence-exact value='0'/>
              ${htmlEncodeAvatar(spokenText)}
            </voice>
          </speak>`;

      const result =
        await avatarSynthesizerRef.current.speakSsmlAsync(spokenSsml);

      if (result.reason === SpeechSDK.ResultReason.SynthesizingAudioCompleted) {
        console.log(`Speech completed: ${spokenText}`);
        updateCaptionQueue(spokenText);
      } else {
        updateCaptionQueue(spokenText);
        throw new Error('Speech synthesis failed: ' + JSON.stringify(result));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const stopAvatarSpeaking = async () => {
    if (!avatarSynthesizerRef.current) return;

    try {
      await avatarSynthesizerRef.current.stopSpeakingAsync();
    } catch (error) {
      console.log(error);
    }
  };

  return profile?.buildInFunctions ? (
    <div className="content-actions container_bg remoteVideo">
      {avatarStatus === AVATAR_STARTING && (
        <div style={componentLoading.camLoading}>
          <div style={componentLoading.spinner} key={'avatarLoading'}></div>
        </div>
      )}

      <button
        className="content-block-btn"
        onClick={toggleAvatar}
        style={{ display: avatarStatus === AVATAR_STARTING ? 'none' : '' }}
      >
        {avatarStatus === AVATAR_READY ? 'Off' : 'On'}
      </button>

      <video
        ref={avatarVideoRef}
        style={{ display: avatarStatus === AVATAR_READY ? '' : 'none' }}
      >
        Your browser does not support the video tag.
      </video>

      <audio
        ref={avatarAudioRef}
        style={{ display: avatarStatus === AVATAR_READY ? '' : 'none' }}
      >
        Your browser does not support the audio tag.
      </audio>
    </div>
  ) : null;
};

export default Avatar;
