import React, { useEffect, useCallback } from 'react';
import * as sdk from 'microsoft-cognitiveservices-speech-sdk';
import { useContexts } from '../providers/AppProvider';
import {
  AVATAR_READY,
  SPEECH_LANGUAGE_DEFAULT,
  SPEECH_METHOD_COMPLETION,
  SPEECH_VOICE_WOMAN,
  speechLanguageMapMan,
  speechLanguageMapWoman,
} from '../lib/const';
import { Profiles } from '../lib/Profiles';
import TaskQueue from './speech_queue';

const SpeechTTS: React.FC = () => {
  const {
    needSpeechQueueRef,
    avatarStatusRef,
    setNeedSpeechQueue,
    lastMessageTextArrayRef,
    setLastMessageTextArray,
  } = useContexts();

  const profiles = new Profiles();
  const profile = profiles.currentProfile;

  const speechKey = profile?.cogSvcSubKey || '';
  const serviceRegion = profile?.cogSvcRegion || '';
  const detectLanguage = profile?.detectLanguage || SPEECH_LANGUAGE_DEFAULT;
  const speechVoice = profile?.speechVoice || SPEECH_VOICE_WOMAN;

  const getSynthesizer = useCallback(() => {
    if (speechKey && serviceRegion) {
      const speechConfig = sdk.SpeechConfig.fromSubscription(
        speechKey,
        serviceRegion,
      );

      const speechSynthesisVoiceName =
        speechVoice === SPEECH_VOICE_WOMAN
          ? speechLanguageMapWoman[detectLanguage]
          : speechLanguageMapMan[detectLanguage];

      speechConfig.speechSynthesisVoiceName = speechSynthesisVoiceName;

      return new sdk.SpeechSynthesizer(speechConfig);
    }
    return null;
  }, [speechKey, serviceRegion]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const speak = async (text: string) => {
    try {
      if (!text.trim()) return;

      const synthesizer = getSynthesizer();

      if (!synthesizer) {
        return;
      }

      await new Promise<void>((resolve, reject) => {
        synthesizer.speakTextAsync(
          text,
          (result) => {
            if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
              console.log(`Speech synthesized: [${text}]`);

              resolve();
            } else if (result.reason === sdk.ResultReason.Canceled) {
              const cancellation = sdk.CancellationDetails.fromResult(result);
              console.error(
                `Speech synthesis canceled: ${cancellation.reason}`,
              );
              if (cancellation.reason === sdk.CancellationReason.Error) {
                console.error(`Error details: ${cancellation.errorDetails}`);
              }
              reject(
                new Error(`Speech synthesis canceled: ${cancellation.reason}`),
              );
            }
          },
          (err) => {
            console.error(err);
            synthesizer.close();
            reject(err);
          },
        );
      });
    } catch (error) {
      console.error('Error fetching audio stream:', error);
    }
  };

  const addTask = useCallback(
    (text: string) => {
      TaskQueue.enqueue(async () => {
        await speak(text);
      }).catch(() => {});
    },
    [speak],
  );

  useEffect(() => {
    const intervalId = setInterval(async () => {
      if (avatarStatusRef.current === AVATAR_READY) {
        return;
      }

      if (profile?.speechMethod === SPEECH_METHOD_COMPLETION) {
        if (lastMessageTextArrayRef.current.length === 0) {
          return;
        }
        const current_text = lastMessageTextArrayRef.current[0];
        addTask(current_text);
        setLastMessageTextArray(lastMessageTextArrayRef.current.slice(1));
      } else {
        if (needSpeechQueueRef?.current?.length === 0) {
          return;
        }
        const current_text = needSpeechQueueRef.current[0];
        addTask(current_text);
        setNeedSpeechQueue(needSpeechQueueRef.current.slice(1));
      }
    }, 100);

    return () => {
      clearInterval(intervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [avatarStatusRef, needSpeechQueueRef, lastMessageTextArrayRef]);

  return null;
};

export default SpeechTTS;
