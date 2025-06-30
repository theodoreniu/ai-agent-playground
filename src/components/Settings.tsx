import React, { useEffect, useRef, useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import { Download, Plus, Settings, Upload, X, Trash } from 'react-feather';
import { Button } from './button/Button';
import Dropdown from './Dropdown';
import { GRAPHRAG_ABOUT } from '../tools/default/azure_docs';
import {
  ALLOW_FUNCTIONS_CHARACTERS,
  ALLOW_PROMPT_CHARACTERS,
  ASSISTANT_TYPE_AGENT_AI,
  ASSISTANT_TYPE_ASSISTANT,
  ASSISTANT_TYPE_DEEPSEEK,
  ASSISTANT_TYPE_REALTIME,
  DEEPSEEK_FUNCTION_CALL_DISABLE,
  DEEPSEEK_FUNCTION_CALL_ENABLE,
  DEFAULT_AGENT_API_URL,
  NOT_SETTINGS_STATUS,
  SPEECH_LANGUAGE_DEFAULT,
  SPEECH_LANGUAGE_EN_US,
  SPEECH_LANGUAGE_ZH_CN,
  SPEECH_LANGUAGE_TH_TH,
  SPEECH_LANGUAGE_VI_VN,
  SPEECH_LANGUAGE_MS_MY,
  SPEECH_LANGUAGE_KO_KR,
  SPEECH_LANGUAGE_JA_JP,
  SCENE_DEFAULT,
  SCENE_AIR_CONDITIONING,
  SPEECH_VOICE_WOMAN,
  SPEECH_VOICE_MAN,
  SPEECH_VOICE_DEFAULT,
  SPEECH_METHOD_STREAM,
  SPEECH_METHOD_COMPLETION,
  SPEECH_METHOD_DEFAULT,
  SPEECH_LANGUAGE_DE_DE,
  SCENE_KITCHEN,
  ASSISTANT_TYPE_RESPONSES,
  SPEECH_LANGUAGE_EN_GB,
  SPEECH_LANGUAGE_FR_FR,
  SPEECH_LANGUAGE_ES_ES,
  ASSISTANT_TYPE_REALTIME_WEB_RTC,
} from '../lib/const';
import { useContexts } from '../providers/AppProvider';
import { svgToBase64 } from '../lib/helper';
import defaultIcon from '../static/logomark.svg';
import { Profiles } from '../lib/Profiles';
const DEFAULT = 'Default';
const REAL_TIME_API = 'Realtime';
const GPT_IMAGE = 'Image';
const GRAPHRAG = 'RAG';
const SPEECH = 'Speech';
const TTS = 'TTS';
const COMPLETION = 'Completion';
const DEEPSEEK = 'DeepSeek';
const TOKENS = 'Third API';
const FUNCTIONS = 'Functions';
const AGENT_AI = 'Agent';
const PROMPT = 'Prompt';
const BING = 'Bing';

const temperatureOptions = [
  { value: '0', label: '0' },
  { value: '0.1', label: '0.1' },
  { value: '0.2', label: '0.2' },
  { value: '0.3', label: '0.3' },
  { value: '0.4', label: '0.4' },
  { value: '0.5', label: '0.5' },
  { value: '0.6', label: '0.6' },
  { value: '0.7', label: '0.7' },
  { value: '0.8', label: '0.8' },
  { value: '0.9', label: '0.9' },
  { value: '1', label: '1' },
];

export const supportedAssistantTypes = [
  { value: ASSISTANT_TYPE_REALTIME, label: 'Realtime' },
  { value: ASSISTANT_TYPE_REALTIME_WEB_RTC, label: 'Realtime WebRTC' },
  { value: ASSISTANT_TYPE_AGENT_AI, label: 'Agent API' },
  { value: ASSISTANT_TYPE_ASSISTANT, label: 'STT -> Assistant -> TTS' },
  { value: ASSISTANT_TYPE_DEEPSEEK, label: 'STT -> DeepSeek -> TTS' },
  { value: ASSISTANT_TYPE_RESPONSES, label: 'STT -> Responses -> TTS' },
];

export const supportedScenes = [
  { value: SCENE_DEFAULT, label: SCENE_DEFAULT },
  {
    value: SCENE_AIR_CONDITIONING,
    label: SCENE_AIR_CONDITIONING,
  },
  {
    value: SCENE_KITCHEN,
    label: SCENE_KITCHEN,
  },
];

export const supportedSpeechLanguages = [
  { value: SPEECH_LANGUAGE_ZH_CN, label: SPEECH_LANGUAGE_ZH_CN },
  { value: SPEECH_LANGUAGE_EN_US, label: SPEECH_LANGUAGE_EN_US },
  { value: SPEECH_LANGUAGE_EN_GB, label: SPEECH_LANGUAGE_EN_GB },
  { value: SPEECH_LANGUAGE_TH_TH, label: SPEECH_LANGUAGE_TH_TH },
  { value: SPEECH_LANGUAGE_VI_VN, label: SPEECH_LANGUAGE_VI_VN },
  { value: SPEECH_LANGUAGE_DE_DE, label: SPEECH_LANGUAGE_DE_DE },
  { value: SPEECH_LANGUAGE_JA_JP, label: SPEECH_LANGUAGE_JA_JP },
  { value: SPEECH_LANGUAGE_KO_KR, label: SPEECH_LANGUAGE_KO_KR },
  { value: SPEECH_LANGUAGE_MS_MY, label: SPEECH_LANGUAGE_MS_MY },
  { value: SPEECH_LANGUAGE_FR_FR, label: SPEECH_LANGUAGE_FR_FR },
  { value: SPEECH_LANGUAGE_ES_ES, label: SPEECH_LANGUAGE_ES_ES },
];

export const supportedSpeechVoices = [
  { value: SPEECH_VOICE_WOMAN, label: SPEECH_VOICE_WOMAN },
  { value: SPEECH_VOICE_MAN, label: SPEECH_VOICE_MAN },
];

const deepSeekFunctionCallingTypes = [
  { value: DEEPSEEK_FUNCTION_CALL_DISABLE, label: 'Disable' },
  { value: DEEPSEEK_FUNCTION_CALL_ENABLE, label: 'Enable' },
];

const speechMethodOptions = [
  { value: SPEECH_METHOD_STREAM, label: 'Stream' },
  { value: SPEECH_METHOD_COMPLETION, label: 'Completion' },
];

const useAgentProxyOptions = [
  { value: 'Enable', label: 'Enable' },
  { value: 'Disable', label: 'Disable' },
];

const SettingsComponent: React.FC<{
  connectStatus: string;
}> = ({ connectStatus }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(DEFAULT);

  const { resetApp, isNightMode } = useContexts();

  const styles = {
    link: {
      color: isNightMode ? '#dddddd' : '#3e3e47',
    },
    settingsModal: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 990000,
    } as React.CSSProperties,
    settingsModalContent: {
      backgroundColor: isNightMode ? '#262525' : '#ededed',
      padding: '20px',
      borderRadius: '8px',
      color: isNightMode ? '#dddddf' : '#3e3e47',
      width: '895px',
      maxHeight: '90%',
      overflowY: 'auto',
    } as React.CSSProperties,
    settingsModalHeader: {
      fontSize: '20px',
      marginBottom: '14px',
    } as React.CSSProperties,
    settingsModalClose: {
      marginBottom: '10px',
      cursor: 'pointer',
      border: 'none',
      float: 'right',
      fontSize: '14px',
      backgroundColor: 'transparent',
      '&:hover': {
        color: isNightMode ? '#a8a7a7' : '#515050',
      },
    } as React.CSSProperties,
    settingModalImageContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '10px',
    } as React.CSSProperties,
    settingModalImage: {
      width: '100px',
      height: '100px',
      objectFit: 'cover',
    } as React.CSSProperties,
    tabActive: {
      backgroundColor: isNightMode ? '#0a0909' : '#ccc',
    } as React.CSSProperties,
    settingsTabButtons: {
      display: 'flex',
      gap: '-1px',
      marginTop: '20px',
      marginBottom: '20px',
    } as React.CSSProperties,
    settingsTabButton: {
      backgroundColor: 'transparent',
      border: '1px solid #b2b1b1',
      padding: '8px 10px',
      cursor: 'pointer',
      margin: '0',
      borderRight: 'none',
    } as React.CSSProperties,
    settingsTabButtonLast: {
      borderRight: '1px solid #b2b1b1',
    } as React.CSSProperties,
    settingLabel: {
      fontSize: '12px',
      textAlign: 'left',
      marginTop: '15px',
      marginBottom: '5px',
    } as React.CSSProperties,
    settingLabelTip: {
      fontSize: '10px',
      textAlign: 'right',
      display: 'inline',
      marginLeft: '10px',
      bottom: '0',
    } as React.CSSProperties,
    settingLabelShow: {
      fontSize: '13px',
      textAlign: 'right',
      display: 'inline',
      float: 'right',
      position: 'relative',
      cursor: 'pointer',
    } as React.CSSProperties,
    settingInput: {
      padding: '10px',
      border: '0px solid #ccc',
      borderRadius: '4px',
      width: '100%',
      height: '35px',
      fontSize: '12px',
      margin: '0',
      backgroundColor: isNightMode
        ? 'rgba(0, 0, 0, 0.8)'
        : 'rgba(0, 0, 0, 0.1)',
      color: isNightMode ? '#ffffff' : '#000000',

      ':disabled': {
        backgroundColor: '#336643',
      },
    } as React.CSSProperties,
    settings_inline: {
      display: 'flex',
      gap: '20px',
    } as React.CSSProperties,
    settings_inline_block: {
      display: 'inline-block',
      width: '100%',
    } as React.CSSProperties,
    export_settings: {
      border: '1px solid #b2b1b1',
      background: 'transparent',
      marginTop: '20px',
    } as React.CSSProperties,
    settings_tip: {
      backgroundColor: isNightMode
        ? 'rgba(0, 0, 0, 0.2)'
        : 'rgba(0, 0, 0, 0.1)',
      padding: '0.5rem',
      borderRadius: '0.3rem',
      marginBottom: '0.5rem',
      marginTop: '0.5rem',
      width: '100%',
      fontStyle: 'italic',
    } as React.CSSProperties,
    appIcon: {
      height: '40px',
      background: 'transparent',
      marginTop: '10px',
      cursor: 'pointer',
      border: '1px solid #b2b1b1',
      padding: '5px',
    } as React.CSSProperties,
    settingBtn: {
      border: 'none',
      backgroundColor: isNightMode
        ? 'rgba(0, 0, 0, 0.8)'
        : 'rgba(0, 0, 0, 0.1)',
    } as React.CSSProperties,
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsModalOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Default Settings Tab
  const DefaultSettings = () => {
    const [profiles, setProfiles] = useState(new Profiles());

    return (
      <div>
        <div style={styles.settings_inline}>
          <div style={styles.settings_inline_block}>
            <div style={styles.settingLabel}>Profiles</div>

            <Dropdown
              options={profiles.getProfileNamesAsDropdown()}
              selectedValue={profiles.currentProfile?.id || ''}
              onChange={(profile_id: string) => {
                const p = profiles.find(profile_id);
                if (p) {
                  profiles.switch(p);
                  setProfiles(new Profiles());
                }
              }}
            />
          </div>

          <div style={styles.settings_inline_block}>
            <div style={styles.settingLabel}>Profile Name</div>
            <input
              type={'text'}
              style={styles.settingInput}
              value={profiles.currentProfile?.name || ''}
              onChange={(e) => {
                profiles.currentProfile!.name = e.target.value;
                profiles.save();
                setProfiles(new Profiles());
              }}
            />
          </div>

          <div style={styles.settings_inline_block}>
            <div style={styles.settingLabel}>Title</div>
            <input
              type={'text'}
              style={styles.settingInput}
              value={profiles.currentProfile?.title || ''}
              onChange={(e) => {
                profiles.currentProfile!.title = e.target.value;
                profiles.save();
                setProfiles(new Profiles());
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '60px' }}>
          <div>
            <div style={styles.settingLabel}>Dark Icon</div>
            <img
              src={profiles.currentProfile?.appIconDark || defaultIcon}
              alt="App Icon"
              style={{ ...styles.appIcon, backgroundColor: '#000000' }}
              onClick={(e) => {
                e.stopPropagation();
                const fileInput = document.createElement('input');
                fileInput.type = 'file';
                fileInput.accept = '.svg';
                fileInput.onchange = (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                      const svgData = e.target?.result;
                      if (svgData) {
                        const imgStr = svgToBase64(svgData as string);
                        profiles.currentProfile!.appIconDark = imgStr;
                        profiles.save();
                        setProfiles(new Profiles());
                      }
                    };
                    reader.readAsText(file);
                  }
                };
                fileInput.click();
              }}
            />
          </div>

          <div>
            <div style={styles.settingLabel}>Light Icon</div>
            <img
              src={profiles.currentProfile?.appIconLight || defaultIcon}
              alt="App Icon"
              style={{ ...styles.appIcon }}
              onClick={(e) => {
                e.stopPropagation();
                const fileInput = document.createElement('input');
                fileInput.type = 'file';
                fileInput.accept = '.svg';
                fileInput.onchange = (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                      const svgData = e.target?.result;
                      if (svgData) {
                        const imgStr = svgToBase64(svgData as string);
                        profiles.currentProfile!.appIconLight = imgStr;
                        profiles.save();
                        setProfiles(new Profiles());
                      }
                    };
                    reader.readAsText(file);
                  }
                };
                fileInput.click();
              }}
            />
          </div>

          <div>
            <div style={styles.settingLabel}>Reset Icon</div>
            <img
              src={defaultIcon}
              alt="App Icon"
              style={{ ...styles.appIcon }}
              onClick={() => {
                profiles.currentProfile!.appIconDark = '';
                profiles.currentProfile!.appIconLight = '';
                profiles.save();
                setProfiles(new Profiles());
              }}
            />
          </div>
        </div>

        <div style={styles.settings_inline}>
          <div style={styles.settings_inline_block}>
            <div style={styles.settingLabel}>Assistant Type</div>
            <Dropdown
              options={supportedAssistantTypes}
              selectedValue={profiles.currentProfile?.assistantType || ''}
              onChange={(e) => {
                profiles.currentProfile!.assistantType = e;
                profiles.save();
                setProfiles(new Profiles());
              }}
            />
          </div>
          <div style={styles.settings_inline_block}>
            <div style={styles.settingLabel}>Scenario</div>
            <Dropdown
              options={supportedScenes}
              selectedValue={profiles.currentProfile?.scene || SCENE_DEFAULT}
              onChange={(e) => {
                profiles.currentProfile!.scene = e;
                profiles.save();
                setProfiles(new Profiles());
              }}
            />
          </div>

          <div style={styles.settings_inline_block}>
            <div style={styles.settingLabel}>Temperature</div>
            <Dropdown
              options={temperatureOptions}
              selectedValue={
                profiles.currentProfile?.temperature.toString() || ''
              }
              onChange={(e) => {
                profiles.currentProfile!.temperature = parseFloat(e);
                profiles.save();
                setProfiles(new Profiles());
              }}
            />
          </div>
        </div>

        <div style={styles.settings_inline}>
          <div style={styles.settings_inline_block}>
            <Button
              label={'Clone Profile'}
              icon={Plus}
              style={{ ...styles.export_settings, ...styles.settingBtn }}
              buttonStyle={'regular'}
              onClick={() => {
                profiles.clone();
                setProfiles(new Profiles());
              }}
            />
          </div>

          <div style={styles.settings_inline_block}>
            <Button
              label={'Delete Profile'}
              icon={Trash}
              style={{ ...styles.export_settings, ...styles.settingBtn }}
              buttonStyle={'regular'}
              onClick={() => {
                profiles.delete(profiles.currentProfile);
                setProfiles(new Profiles());
              }}
            />
          </div>

          <div style={styles.settings_inline_block}>
            <Button
              label={'Import Profiles'}
              icon={Upload}
              style={{ ...styles.export_settings, ...styles.settingBtn }}
              buttonStyle={'regular'}
              onClick={() => {
                if (fileInputRef.current) {
                  fileInputRef.current.click();
                }
              }}
            />
            <input
              type="file"
              accept=".json"
              ref={fileInputRef}
              onChange={handleImport}
              style={{ display: 'none' }}
            />
          </div>

          <div style={styles.settings_inline_block}>
            <Button
              label={'Export Profiles'}
              icon={Download}
              style={{ ...styles.export_settings, ...styles.settingBtn }}
              buttonStyle={'regular'}
              onClick={handleExport}
            />
          </div>
        </div>
      </div>
    );
  };

  // Realtime Settings Tab
  const Realtime = () => {
    const [profiles, setProfiles] = useState(new Profiles());

    return (
      <div>
        <div style={styles.settingLabel}>Target URI</div>
        <input
          type={'text'}
          style={styles.settingInput}
          value={profiles.currentProfile?.realtimeEndpoint || ''}
          placeholder={
            'https://xxx.openai.azure.com/openai/realtime?api-version=2024-10-01-preview&deployment=xxx'
          }
          onChange={(e) => {
            profiles.currentProfile!.realtimeEndpoint = e.target.value;
            profiles.save();
            setProfiles(new Profiles());
          }}
        />

        <div style={styles.settingLabel}>
          Key
          <span style={styles.settingLabelShow} onClick={toggleVisibility}>
            {isVisible ? <FaRegEye /> : <FaRegEyeSlash />}
          </span>
        </div>
        <input
          type={isVisible ? 'text' : 'password'}
          style={styles.settingInput}
          value={profiles.currentProfile?.realtimeKey || ''}
          placeholder={''}
          onChange={(e) => {
            profiles.currentProfile!.realtimeKey = e.target.value;
            profiles.save();
            setProfiles(new Profiles());
          }}
        />

        <div style={styles.settingLabel}>Realtime Region</div>
        <input
          type={'text'}
          style={styles.settingInput}
          value={profiles.currentProfile?.realtimeRegion || ''}
          placeholder={'eastus2'}
          onChange={(e) => {
            profiles.currentProfile!.realtimeRegion = e.target.value;
            profiles.save();
            setProfiles(new Profiles());
          }}
        />
      </div>
    );
  };

  // TTS Settings Tab
  const SettingsTTS = () => {
    const [profiles, setProfiles] = useState(new Profiles());

    return (
      <div>
        <div style={styles.settingLabel}>Target URI</div>
        <input
          type={'text'}
          style={styles.settingInput}
          value={profiles.currentProfile?.ttsTargetUri || ''}
          placeholder={
            'https://xxxx.openai.azure.com/openai/deployments/tts/audio/speech?api-version=2024-05-01-preview'
          }
          onChange={(e) => {
            profiles.currentProfile!.ttsTargetUri = e.target.value;
            profiles.save();
            setProfiles(new Profiles());
          }}
        />

        <div style={styles.settingLabel}>
          Key
          <span style={styles.settingLabelShow} onClick={toggleVisibility}>
            {isVisible ? <FaRegEye /> : <FaRegEyeSlash />}
          </span>
        </div>
        <input
          type={isVisible ? 'text' : 'password'}
          style={styles.settingInput}
          value={profiles.currentProfile?.ttsApiKey || ''}
          placeholder={''}
          onChange={(e) => {
            profiles.currentProfile!.ttsApiKey = e.target.value;
            profiles.save();
            setProfiles(new Profiles());
          }}
        />

        <div style={styles.settingLabel}>Model</div>
        <input
          type={'text'}
          style={styles.settingInput}
          value={profiles.currentProfile?.ttsModel || 'gpt-4o-mini-tts'}
          placeholder={'gpt-4o-mini-tts'}
          onChange={(e) => {
            profiles.currentProfile!.ttsModel = e.target.value;
            profiles.save();
            setProfiles(new Profiles());
          }}
        />

        <div style={styles.settingLabel}>Voice</div>
        <input
          type={'text'}
          style={styles.settingInput}
          value={profiles.currentProfile?.ttsVoice || 'alloy'}
          placeholder={'alloy'}
          onChange={(e) => {
            profiles.currentProfile!.ttsVoice = e.target.value;
            profiles.save();
            setProfiles(new Profiles());
          }}
        />
      </div>
    );
  };

  // GPT_IMAGE Settings Tab
  const GptImage = () => {
    const [profiles, setProfiles] = useState(new Profiles());

    return (
      <div>
        <div style={styles.settingLabel}>Target URI</div>
        <input
          type={'text'}
          style={styles.settingInput}
          value={profiles.currentProfile?.gptImageTargetUri || ''}
          placeholder={
            'https://xxx.openai.azure.com/openai/deployments/gpt-image-1/images/generations?api-version=2025-04-01-preview'
          }
          onChange={(e) => {
            profiles.currentProfile!.gptImageTargetUri = e.target.value;
            profiles.save();
            setProfiles(new Profiles());
          }}
        />

        <div style={styles.settingLabel}>
          Key
          <span style={styles.settingLabelShow} onClick={toggleVisibility}>
            {isVisible ? <FaRegEye /> : <FaRegEyeSlash />}
          </span>
        </div>
        <input
          type={isVisible ? 'text' : 'password'}
          style={styles.settingInput}
          value={profiles.currentProfile?.gptImageApiKey || ''}
          placeholder={''}
          onChange={(e) => {
            profiles.currentProfile!.gptImageApiKey = e.target.value;
            profiles.save();
            setProfiles(new Profiles());
          }}
        />
      </div>
    );
  };

  // GraphRAG Settings Tab
  const GraphRAG = () => {
    const [profiles, setProfiles] = useState(new Profiles());

    return (
      <div>
        <div style={styles.settings_tip}>
          Currently only local search is supported.{' '}
          <a
            href="https://github.com/theodoreniu/graphrag_webui"
            target="_blank"
            style={styles.link}
          >
            How to deploy a GraphRAG API?
          </a>
        </div>
        <div style={styles.settingLabel}>API URL</div>
        <input
          type={'text'}
          style={styles.settingInput}
          value={profiles.currentProfile?.graphragUrl || ''}
          placeholder={'https://xxx.xxx.xxx.azurecontainerapps.io'}
          onChange={(e) => {
            profiles.currentProfile!.graphragUrl = e.target.value;
            profiles.save();
            setProfiles(new Profiles());
          }}
        />

        <div style={styles.settingLabel}>
          API Key
          <span style={styles.settingLabelShow} onClick={toggleVisibility}>
            {isVisible ? <FaRegEye /> : <FaRegEyeSlash />}
          </span>
        </div>
        <input
          type={isVisible ? 'text' : 'password'}
          style={styles.settingInput}
          value={profiles.currentProfile?.graphragApiKey || ''}
          placeholder={''}
          onChange={(e) => {
            profiles.currentProfile!.graphragApiKey = e.target.value;
            profiles.save();
            setProfiles(new Profiles());
          }}
        />

        <div style={styles.settingLabel}>Project Name</div>
        <input
          type={'text'}
          style={styles.settingInput}
          value={profiles.currentProfile?.graphragProjectName || ''}
          placeholder={''}
          onChange={(e) => {
            profiles.currentProfile!.graphragProjectName = e.target.value;
            profiles.save();
            setProfiles(new Profiles());
          }}
        />

        <div style={styles.settingLabel}>About</div>
        <input
          type={'text'}
          style={styles.settingInput}
          value={profiles.currentProfile?.graphragAbout || ''}
          placeholder={GRAPHRAG_ABOUT}
          onChange={(e) => {
            profiles.currentProfile!.graphragAbout = e.target.value;
            profiles.save();
            setProfiles(new Profiles());
          }}
        />
      </div>
    );
  };

  // Speech Settings Tab
  const Speech = () => {
    const [profiles, setProfiles] = useState(new Profiles());

    return (
      <div>
        <div style={styles.settings_inline}>
          <div style={styles.settings_inline_block}>
            <div style={styles.settingLabel}>
              Detect/Synthesize/LLM Language
            </div>
            <Dropdown
              options={supportedSpeechLanguages}
              selectedValue={
                profiles.currentProfile?.detectLanguage ||
                SPEECH_LANGUAGE_DEFAULT
              }
              onChange={(e) => {
                profiles.currentProfile!.detectLanguage = e;
                profiles.save();
                setProfiles(new Profiles());
              }}
            />
          </div>

          <div style={styles.settings_inline_block}>
            <div style={styles.settingLabel}>Voice</div>
            <Dropdown
              options={supportedSpeechVoices}
              selectedValue={
                profiles.currentProfile?.speechVoice || SPEECH_VOICE_DEFAULT
              }
              onChange={(e) => {
                profiles.currentProfile!.speechVoice = e;
                profiles.save();
                setProfiles(new Profiles());
              }}
            />
          </div>

          <div style={styles.settings_inline_block}>
            <div style={styles.settingLabel}>Speech Method</div>
            <Dropdown
              options={speechMethodOptions}
              selectedValue={
                profiles.currentProfile?.speechMethod || SPEECH_METHOD_DEFAULT
              }
              onChange={(e) => {
                profiles.currentProfile!.speechMethod = e;
                profiles.save();
                setProfiles(new Profiles());
              }}
            />
          </div>
        </div>

        <div style={styles.settingLabel}>Speech Region</div>
        <input
          type={'text'}
          style={styles.settingInput}
          value={profiles.currentProfile?.cogSvcRegion || ''}
          placeholder={'southeastasia'}
          onChange={(e) => {
            profiles.currentProfile!.cogSvcRegion = e.target.value;
            profiles.save();
            setProfiles(new Profiles());
          }}
        />

        <div style={styles.settingLabel}>
          Speech Subscription Key
          <span style={styles.settingLabelShow} onClick={toggleVisibility}>
            {isVisible ? <FaRegEye /> : <FaRegEyeSlash />}
          </span>
        </div>

        <input
          type={isVisible ? 'text' : 'password'}
          style={styles.settingInput}
          value={profiles.currentProfile?.cogSvcSubKey || ''}
          placeholder={''}
          onChange={(e) => {
            profiles.currentProfile!.cogSvcSubKey = e.target.value;
            profiles.save();
            setProfiles(new Profiles());
          }}
        />

        <div style={styles.settingLabel}>Avatar Region</div>
        <input
          type={'text'}
          style={styles.settingInput}
          value={profiles.currentProfile?.avatarRegion || ''}
          placeholder={'southeastasia'}
          onChange={(e) => {
            profiles.currentProfile!.avatarRegion = e.target.value;
            profiles.save();
            setProfiles(new Profiles());
          }}
        />

        <div style={styles.settingLabel}>
          Avatar Subscription Key
          <span style={styles.settingLabelShow} onClick={toggleVisibility}>
            {isVisible ? <FaRegEye /> : <FaRegEyeSlash />}
          </span>
        </div>
        <input
          type={isVisible ? 'text' : 'password'}
          style={styles.settingInput}
          value={profiles.currentProfile?.avatarSubKey || ''}
          placeholder={''}
          onChange={(e) => {
            profiles.currentProfile!.avatarSubKey = e.target.value;
            profiles.save();
            setProfiles(new Profiles());
          }}
        />
      </div>
    );
  };

  // Bing Settings Tab
  const Bing = () => {
    const [profiles, setProfiles] = useState(new Profiles());

    return (
      <div>
        <div style={styles.settingLabel}>
          Key
          <span style={styles.settingLabelShow} onClick={toggleVisibility}>
            {isVisible ? <FaRegEye /> : <FaRegEyeSlash />}
          </span>
        </div>
        <input
          type={isVisible ? 'text' : 'password'}
          style={styles.settingInput}
          value={profiles.currentProfile?.bingApiKey || ''}
          placeholder={''}
          onChange={(e) => {
            profiles.currentProfile!.bingApiKey = e.target.value;
            profiles.save();
            setProfiles(new Profiles());
          }}
        />

        <div style={styles.settingLabel}>Endpoint</div>
        <input
          type={'text'}
          style={styles.settingInput}
          disabled
          onChange={(e) => {
            profiles.currentProfile!.bingEndpoint = e.target.value;
            profiles.save();
            setProfiles(new Profiles());
          }}
          value={'https://api.bing.microsoft.com/'}
        />

        <div style={styles.settingLabel}>Location</div>
        <input
          type={'text'}
          style={styles.settingInput}
          disabled
          onChange={(e) => {
            profiles.currentProfile!.bingLocation = e.target.value;
            profiles.save();
            setProfiles(new Profiles());
          }}
          value={'global'}
        />
      </div>
    );
  };

  // Completion Settings Tab
  const Completion = () => {
    const [profiles, setProfiles] = useState(new Profiles());

    return (
      <div>
        <div style={styles.settingLabel}>Target URI</div>
        <input
          type={'text'}
          style={styles.settingInput}
          value={profiles.currentProfile?.completionTargetUri || ''}
          placeholder={
            'https://xxxx.openai.azure.com/openai/deployments/gpt-4o-mini/chat/completions?api-version=2024-08-01-preview'
          }
          onChange={(e) => {
            profiles.currentProfile!.completionTargetUri = e.target.value;
            profiles.save();
            setProfiles(new Profiles());
          }}
        />

        <div style={styles.settingLabel}>
          Key
          <span style={styles.settingLabelShow} onClick={toggleVisibility}>
            {isVisible ? <FaRegEye /> : <FaRegEyeSlash />}
          </span>
        </div>
        <input
          type={isVisible ? 'text' : 'password'}
          style={styles.settingInput}
          value={profiles.currentProfile?.completionApiKey || ''}
          placeholder={''}
          onChange={(e) => {
            profiles.currentProfile!.completionApiKey = e.target.value;
            profiles.save();
            setProfiles(new Profiles());
          }}
        />
      </div>
    );
  };

  // DeepSeek Settings Tab
  const DeepSeek = () => {
    const [profiles, setProfiles] = useState(new Profiles());

    return (
      <div>
        <p style={styles.settings_tip}>
          <a
            href="https://ai.azure.com/explore/models/DeepSeek-R1/version/1/registry/azureml-deepseek?tid=a284bf15-c9ca-4f17-a034-9a459c7cb8d1"
            target="_blank"
            style={styles.link}
          >
            How to deploy DeepSeek in Azure AI Foundry?
          </a>
        </p>

        <div style={styles.settingLabel}>Deployment name</div>
        <input
          type={'text'}
          style={styles.settingInput}
          value={profiles.currentProfile?.deepSeekDeploymentName || ''}
          placeholder={profiles.currentProfile?.deepSeekDeploymentName || ''}
          onChange={(e) => {
            profiles.currentProfile!.deepSeekDeploymentName = e.target.value;
            profiles.save();
            setProfiles(new Profiles());
          }}
        />

        <div style={styles.settingLabel}>Target URI</div>
        <input
          type={'text'}
          style={styles.settingInput}
          value={profiles.currentProfile?.deepSeekTargetUri || ''}
          placeholder={
            'https://ai-xxx.services.ai.azure.com/models/chat/completions?api-version=2024-05-01-preview'
          }
          onChange={(e) => {
            profiles.currentProfile!.deepSeekTargetUri = e.target.value;
            profiles.save();
            setProfiles(new Profiles());
          }}
        />

        <div style={styles.settingLabel}>
          Key
          <span style={styles.settingLabelShow} onClick={toggleVisibility}>
            {isVisible ? <FaRegEye /> : <FaRegEyeSlash />}
          </span>
        </div>
        <input
          type={isVisible ? 'text' : 'password'}
          style={styles.settingInput}
          value={profiles.currentProfile?.deepSeekApiKey || ''}
          placeholder={''}
          onChange={(e) => {
            profiles.currentProfile!.deepSeekApiKey = e.target.value;
            profiles.save();
            setProfiles(new Profiles());
          }}
        />

        <div style={styles.settingLabel}>Function Calling</div>
        <p style={styles.settings_tip}>
          The current version of the deepseek-chat model's Function Calling
          capability is unstable, which may result in looped calls or empty
          responses. We are actively working on a fix, and it is expected to be
          resolved in the next version.
          <a
            href="https://api-docs.deepseek.com/guides/function_calling"
            target="_blank"
            style={styles.link}
          >
            Function Calling
          </a>
        </p>
        <Dropdown
          options={deepSeekFunctionCallingTypes}
          selectedValue={
            profiles.currentProfile?.deepSeekFunctionCalling ||
            DEEPSEEK_FUNCTION_CALL_DISABLE
          }
          onChange={(e) => {
            profiles.currentProfile!.deepSeekFunctionCalling = e;
            profiles.save();
            setProfiles(new Profiles());
          }}
        />
      </div>
    );
  };

  // Prompt Settings Tab
  const Prompt = () => {
    const [profiles, setProfiles] = useState(new Profiles());

    return (
      <div>
        <div style={styles.settingLabel}>Prompt URL (Main)</div>
        <input
          type="text"
          style={styles.settingInput}
          value={profiles.currentProfile?.promptUrl || ''}
          placeholder={''}
          onChange={(e) => {
            profiles.currentProfile!.promptUrl = e.target.value;
            profiles.save();
            setProfiles(new Profiles());
            if (e.target.value === '') {
              profiles.currentProfile!.prompt = '';
              profiles.save();
              setProfiles(new Profiles());
            }
          }}
        />

        <div
          style={{
            ...styles.settingLabel,
            display:
              profiles.currentProfile?.promptUrl !== '' ? 'none' : 'block',
          }}
        >
          Prompt
        </div>
        <textarea
          style={{
            ...styles.settingInput,
            height: '250px',
          }}
          value={profiles.currentProfile?.prompt || ''}
          placeholder={''}
          hidden={profiles.currentProfile?.promptUrl !== ''}
          rows={20}
          maxLength={ALLOW_PROMPT_CHARACTERS}
          onChange={(e) => {
            profiles.currentProfile!.prompt = e.target.value;
            profiles.save();
            setProfiles(new Profiles());
          }}
        />

        <div style={styles.settingLabel}>
          Remaining Characters:{' '}
          {ALLOW_PROMPT_CHARACTERS -
            (profiles.currentProfile?.prompt?.length || 0)}
        </div>
      </div>
    );
  };

  // Functions Settings Tab
  const Functions = () => {
    const [profiles, setProfiles] = useState(new Profiles());

    const format_functions = (functions: string) => {
      try {
        return JSON.stringify(JSON.parse(functions), null, 2);
      } catch {
        return functions;
      }
    };

    return (
      <div>
        <div style={styles.settingLabel}>Functions URL (Main)</div>
        <input
          type="text"
          style={styles.settingInput}
          value={profiles.currentProfile?.functionsUrl || ''}
          placeholder={''}
          onChange={(e) => {
            profiles.currentProfile!.functionsUrl = e.target.value;
            profiles.save();
            setProfiles(new Profiles());
            if (e.target.value === '') {
              profiles.currentProfile!.functions = '';
              profiles.save();
              setProfiles(new Profiles());
            }
          }}
        />

        <div
          style={{
            ...styles.settingLabel,
            display:
              profiles.currentProfile?.functionsUrl !== '' ? 'none' : 'block',
          }}
        >
          Functions
        </div>
        <textarea
          style={{
            ...styles.settingInput,
            height: '250px',
          }}
          value={format_functions(profiles.currentProfile?.functions || '')}
          placeholder={''}
          hidden={profiles.currentProfile?.functionsUrl !== ''}
          rows={20}
          maxLength={ALLOW_FUNCTIONS_CHARACTERS}
          onChange={(e) => {
            profiles.currentProfile!.functions = e.target.value;
            profiles.save();
            setProfiles(new Profiles());
          }}
        />

        <div style={styles.settingLabel}>
          Remaining Characters:{' '}
          {ALLOW_FUNCTIONS_CHARACTERS -
            (profiles.currentProfile?.functions?.length || 0)}
        </div>
      </div>
    );
  };

  // Agent AI Settings Tab
  const AgentAI = () => {
    const [profiles, setProfiles] = useState(new Profiles());

    return (
      <div>
        <div style={styles.settings_tip}>
          You can get your own key from
          <a
            href="https://agent.azuretsp.com"
            target="_blank"
            style={{ ...styles.link, marginLeft: '8px' }}
          >
            https://agent.azuretsp.com
          </a>
        </div>

        <div style={styles.settingLabel}>API URL</div>
        <input
          type="text"
          style={styles.settingInput}
          value={profiles.currentProfile?.agentApiUrl || DEFAULT_AGENT_API_URL}
          placeholder={DEFAULT_AGENT_API_URL}
          onChange={(e) => {
            profiles.currentProfile!.agentApiUrl = e.target.value;
            profiles.save();
            setProfiles(new Profiles());
            if (e.target.value === '') {
              profiles.currentProfile!.agentApiUrl = '';
              profiles.save();
              setProfiles(new Profiles());
            }
          }}
        />

        <div style={styles.settingLabel}>
          Key
          <span style={styles.settingLabelShow} onClick={toggleVisibility}>
            {isVisible ? <FaRegEye /> : <FaRegEyeSlash />}
          </span>
        </div>
        <input
          type={isVisible ? 'text' : 'password'}
          style={styles.settingInput}
          value={profiles.currentProfile?.agentApiKey || ''}
          placeholder={''}
          onChange={(e) => {
            profiles.currentProfile!.agentApiKey = e.target.value;
            profiles.save();
            setProfiles(new Profiles());
          }}
        />

        <div style={styles.settingLabel}>
          Use Agent Proxy for Realtime, Speech, Avatar
        </div>
        <Dropdown
          options={useAgentProxyOptions}
          selectedValue={
            profiles.currentProfile?.useAgentProxy ? 'Enable' : 'Disable'
          }
          onChange={(e) => {
            profiles.currentProfile!.useAgentProxy = e === 'Enable';
            profiles.save();
            setProfiles(new Profiles());
          }}
        />
      </div>
    );
  };

  // Tokens Settings Tab
  const Tokens = () => {
    const [profiles, setProfiles] = useState(new Profiles());

    return (
      <div>
        <div style={styles.settingLabel}>
          Feishu Bot
          <span style={styles.settingLabelShow} onClick={toggleVisibility}>
            {isVisible ? <FaRegEye /> : <FaRegEyeSlash />}
          </span>
        </div>
        <input
          type={isVisible ? 'text' : 'password'}
          style={styles.settingInput}
          value={profiles.currentProfile?.feishuHook || ''}
          placeholder={''}
          onChange={(e) => {
            profiles.currentProfile!.feishuHook = e.target.value;
            profiles.save();
            setProfiles(new Profiles());
          }}
        />

        <div style={styles.settingLabel}>
          <a href="https://finnhub.io/" target="_blank" style={styles.link}>
            Finnhub
          </a>
          <span style={styles.settingLabelShow} onClick={toggleVisibility}>
            {isVisible ? <FaRegEye /> : <FaRegEyeSlash />}
          </span>
        </div>
        <input
          type={isVisible ? 'text' : 'password'}
          style={styles.settingInput}
          value={profiles.currentProfile?.quoteToken || ''}
          placeholder={''}
          onChange={(e) => {
            profiles.currentProfile!.quoteToken = e.target.value;
            profiles.save();
            setProfiles(new Profiles());
          }}
        />

        <div style={styles.settingLabel}>
          <a
            href="https://www.showapi.com/"
            target="_blank"
            style={styles.link}
          >
            News
          </a>
          <span style={styles.settingLabelShow} onClick={toggleVisibility}>
            {isVisible ? <FaRegEye /> : <FaRegEyeSlash />}
          </span>
        </div>
        <input
          type={isVisible ? 'text' : 'password'}
          style={styles.settingInput}
          value={profiles.currentProfile?.newsKey || ''}
          placeholder={''}
          onChange={(e) => {
            profiles.currentProfile!.newsKey = e.target.value;
            profiles.save();
            setProfiles(new Profiles());
          }}
        />

        <div style={styles.settings_inline}>
          <div style={styles.settings_inline_block}>
            <div style={styles.settingLabel}>
              <a
                href="https://www.mxnzp.com/"
                target="_blank"
                style={styles.link}
              >
                Mxnzp AppId
              </a>
            </div>
            <input
              type={'text'}
              style={styles.settingInput}
              value={profiles.currentProfile?.mxnzpAppId || ''}
              placeholder={''}
              onChange={(e) => {
                profiles.currentProfile!.mxnzpAppId = e.target.value;
                profiles.save();
                setProfiles(new Profiles());
              }}
            />
          </div>

          <div style={styles.settings_inline_block}>
            <div style={styles.settingLabel}>
              <a
                href="https://www.mxnzp.com/"
                target="_blank"
                style={styles.link}
              >
                Mxnzp AppSecret
              </a>
              <span style={styles.settingLabelShow} onClick={toggleVisibility}>
                {isVisible ? <FaRegEye /> : <FaRegEyeSlash />}
              </span>
            </div>
            <input
              type={isVisible ? 'text' : 'password'}
              style={styles.settingInput}
              value={profiles.currentProfile?.mxnzpAppSecret || ''}
              placeholder={''}
              onChange={(e) => {
                profiles.currentProfile!.mxnzpAppSecret = e.target.value;
                profiles.save();
                setProfiles(new Profiles());
              }}
            />
          </div>
        </div>
      </div>
    );
  };

  const handleExport = () => {
    const profiles = new Profiles();
    const settings = {
      currentProfileId: profiles.currentProfileId,
      profiles: profiles.profiles,
    };
    const content = JSON.stringify(settings, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ai-agent-playground-profiles.json';
    a.click();
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const e = event.target.files?.[0];
    if (!e) {
      alert('No file selected');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const settings = JSON.parse(e.target?.result as string);

        if (!settings.currentProfileId) {
          alert('Invalid profiles file, currentProfileId is empty');
          return;
        }

        if (!settings.profiles) {
          alert('Invalid profiles file, profiles is empty');
          return;
        }

        const profiles = new Profiles();

        for (const profile of settings.profiles) {
          profiles.profiles.push(profile);
        }

        profiles.currentProfileId = settings.currentProfileId;
        profiles.save();

        alert('Import Profiles succeed, page will reload.');

        window.location.reload();
      } catch (error) {
        console.error(`import error: ${error}`);
      }
    };
    reader.readAsText(e);
  };

  const renderContent = () => {
    switch (activeTab) {
      case DEFAULT:
        return <DefaultSettings />;
      case REAL_TIME_API:
        return <Realtime />;
      case SPEECH:
        return <Speech />;
      case TTS:
        return <SettingsTTS />;
      case GRAPHRAG:
        return <GraphRAG />;
      case GPT_IMAGE:
        return <GptImage />;
      case COMPLETION:
        return <Completion />;
      case DEEPSEEK:
        return <DeepSeek />;
      case TOKENS:
        return <Tokens />;
      case PROMPT:
        return <Prompt />;
      case BING:
        return <Bing />;
      case FUNCTIONS:
        return <Functions />;
      case AGENT_AI:
        return <AgentAI />;
      default:
        return <DefaultSettings />;
    }
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const handleClick = () => {
    setIsModalOpen(true);
  };

  const oldProfiles = new Profiles();

  const closeModal = () => {
    setIsModalOpen(false);

    const newProfiles = new Profiles();

    if (
      JSON.stringify(newProfiles.currentProfile) !==
      JSON.stringify(oldProfiles.currentProfile)
    ) {
      alert('Current profile changed, page will reload.');
      window.location.reload();
    }
  };

  return NOT_SETTINGS_STATUS.includes(connectStatus) ? null : (
    <div className="content-actions">
      <Button
        className="container_bg"
        label={'Settings'}
        icon={Settings}
        onClick={handleClick}
      />

      {isModalOpen && (
        <div style={styles.settingsModal}>
          <div style={styles.settingsModalContent}>
            <button style={styles.settingsModalClose} onClick={closeModal}>
              <X />
            </button>

            <div style={styles.settingsModalHeader}>
              Settings
              <div style={styles.settingLabelTip}>(Local Only)</div>
            </div>

            <div>
              <div style={styles.settingsTabButtons}>
                <button
                  style={{
                    ...styles.settingsTabButton,
                    ...(activeTab === DEFAULT ? styles.tabActive : {}),
                  }}
                  onClick={() => setActiveTab(DEFAULT)}
                >
                  {DEFAULT}
                </button>
                <button
                  style={{
                    ...styles.settingsTabButton,
                    ...(activeTab === AGENT_AI ? styles.tabActive : {}),
                  }}
                  onClick={() => setActiveTab(AGENT_AI)}
                >
                  {AGENT_AI}
                </button>
                <button
                  style={{
                    ...styles.settingsTabButton,
                    ...(activeTab === REAL_TIME_API ? styles.tabActive : {}),
                  }}
                  onClick={() => setActiveTab(REAL_TIME_API)}
                >
                  {REAL_TIME_API}
                </button>
                <button
                  style={{
                    ...styles.settingsTabButton,
                    ...(activeTab === PROMPT ? styles.tabActive : {}),
                  }}
                  onClick={() => setActiveTab(PROMPT)}
                >
                  {PROMPT}
                </button>
                <button
                  style={{
                    ...styles.settingsTabButton,
                    ...(activeTab === FUNCTIONS ? styles.tabActive : {}),
                  }}
                  onClick={() => setActiveTab(FUNCTIONS)}
                >
                  {FUNCTIONS}
                </button>

                <button
                  style={{
                    ...styles.settingsTabButton,
                    ...(activeTab === SPEECH ? styles.tabActive : {}),
                  }}
                  onClick={() => setActiveTab(SPEECH)}
                >
                  {SPEECH}
                </button>
                <button
                  style={{
                    ...styles.settingsTabButton,
                    ...(activeTab === TTS ? styles.tabActive : {}),
                  }}
                  onClick={() => setActiveTab(TTS)}
                >
                  {TTS}
                </button>
                <button
                  style={{
                    ...styles.settingsTabButton,
                    ...(activeTab === COMPLETION ? styles.tabActive : {}),
                  }}
                  onClick={() => setActiveTab(COMPLETION)}
                >
                  {COMPLETION}
                </button>
                <button
                  style={{
                    ...styles.settingsTabButton,
                    ...(activeTab === DEEPSEEK ? styles.tabActive : {}),
                  }}
                  onClick={() => setActiveTab(DEEPSEEK)}
                >
                  {DEEPSEEK}
                </button>
                <button
                  style={{
                    ...styles.settingsTabButton,
                    ...(activeTab === GPT_IMAGE ? styles.tabActive : {}),
                  }}
                  onClick={() => setActiveTab(GPT_IMAGE)}
                >
                  {GPT_IMAGE}
                </button>
                <button
                  style={{
                    ...styles.settingsTabButton,
                    ...(activeTab === BING ? styles.tabActive : {}),
                  }}
                  onClick={() => setActiveTab(BING)}
                >
                  {BING}
                </button>
                <button
                  style={{
                    ...styles.settingsTabButton,
                    ...(activeTab === GRAPHRAG ? styles.tabActive : {}),
                  }}
                  onClick={() => setActiveTab(GRAPHRAG)}
                >
                  {GRAPHRAG}
                </button>
                <button
                  style={{
                    ...styles.settingsTabButton,
                    ...styles.settingsTabButtonLast,
                    ...(activeTab === TOKENS ? styles.tabActive : {}),
                  }}
                  onClick={() => setActiveTab(TOKENS)}
                >
                  {TOKENS}
                </button>
              </div>

              <div className="tab-content">{renderContent()}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsComponent;
