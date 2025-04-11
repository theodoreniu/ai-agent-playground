import { v4 as uuidv4 } from 'uuid';
import {
  APP_AGENT,
  ASSISTANT_TYPE_AGENT_AI,
  ASSISTANT_TYPE_ASSISTANT,
  ASSISTANT_TYPE_DEEPSEEK,
  ASSISTANT_TYPE_DEFAULT,
  ASSISTANT_TYPE_REALTIME,
  ASSISTANT_TYPES,
  DEEPSEEK_FUNCTION_CALL_DISABLE,
  DEFAULT_AGENT_API_URL,
} from './const';
import defaultIcon from '../static/logomark.svg';
import { supportedAssistantTypes } from '../components/Settings';

// Profile is the profile of the app
class Profile {
  public id: string = '';
  public name: string = '';
  public agentApiKey: string = '';
  public agentApiUrl: string = '';
  public appIconDark: string = '';
  public appIconLight: string = '';
  public assistantType: string = '';
  public bingApiKey: string = '';
  public bingEndpoint: string = '';
  public bingLocation: string = '';
  public buildInFunctions: boolean = false;
  public buildInPrompt: boolean = false;
  public cogSvcRegion: string = 'southeastasia';
  public cogSvcSubKey: string = '';
  public avatarRegion: string = 'southeastasia';
  public avatarSubKey: string = '';
  public completionApiKey: string = '';
  public completionTargetUri: string = '';
  public dallApiKey: string = '';
  public dallTargetUri: string = '';
  public deepSeekApiKey: string = '';
  public deepSeekDeploymentName: string = 'DeepSeek-R1';
  public deepSeekFunctionCalling: string = DEEPSEEK_FUNCTION_CALL_DISABLE;
  public deepSeekTargetUri: string = '';
  public feishuHook: string = '';
  public functions: string = '';
  public functionsUrl: string = '';
  public graphragAbout: string = '';
  public graphragApiKey: string = '';
  public graphragProjectName: string = '';
  public graphragUrl: string = '';
  public mxnzpAppId: string = '';
  public mxnzpAppSecret: string = '';
  public newsKey: string = '';
  public prompt: string = '';
  public promptUrl: string = '';
  public quoteToken: string = '';
  public realtimeEndpoint: string = '';
  public realtimeKey: string = '';
  public supportedAssistantType: string = '';
  public temperature: number = 0.5;
  public ttsApiKey: string = '';
  public ttsTargetUri: string = '';
  public useAgentProxy: boolean = false;

  public isAssistant: boolean = this.assistantType === ASSISTANT_TYPE_ASSISTANT;
  public isRealtime: boolean = this.assistantType === ASSISTANT_TYPE_REALTIME;
  public isDeepSeek: boolean = this.assistantType === ASSISTANT_TYPE_DEEPSEEK;
  public isAgentAI: boolean = this.assistantType === ASSISTANT_TYPE_AGENT_AI;

  setProperty<K extends keyof Profile>(key: K, value: Profile[K]) {
    Object.assign(this, { [key]: value });
  }

  getAgentWsUrl(sessionId: string): string {
    const endpoint = this.agentApiUrl
      .replace('http', 'ws')
      .replace('https', 'ws');

    if (!this.agentApiKey) {
      alert('Agent API Key is not set');
      return '';
    }

    return `${endpoint}/ws/agent/${sessionId}?api_key=${this.agentApiKey}`;
  }

  getAgentRealtimeUrl(): string {
    if (!this.useAgentProxy) {
      return this.realtimeEndpoint;
    }

    const endpoint = this.agentApiUrl
      .replace('http', 'ws')
      .replace('https', 'ws');

    if (!this.agentApiKey) {
      alert('Agent API Key is not set');
      return '';
    }

    return `${endpoint}/ws/realtime?api_key=${this.agentApiKey}`;
  }

  getAgentSseUrl(): string {
    const endpoint = this.agentApiUrl;

    if (!this.agentApiKey) {
      alert('Agent API Key is not set');
      return '';
    }

    return `${endpoint}/sse?api_key=${this.agentApiKey}`;
  }

  getAgentSpeechUrl(): string {
    if (!this.useAgentProxy) {
      return `wss://${this.cogSvcRegion}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=en-US&format=simple&profanity=raw`;
    }

    const endpoint = this.agentApiUrl
      .replace('http', 'ws')
      .replace('https', 'ws');

    if (!this.agentApiKey) {
      alert('Agent API Key is not set');
      return '';
    }

    return `${endpoint}/ws/speech?api_key=${this.agentApiKey}`;
  }

  getAgentAvatarUrl(): string {
    if (!this.useAgentProxy) {
      return `wss://${this.cogSvcRegion}.tts.speech.microsoft.com/cognitiveservices/websocket/v1?enableTalkingAvatar=true`;
    }

    const endpoint = this.agentApiUrl
      .replace('http', 'ws')
      .replace('https', 'ws');

    if (!this.agentApiKey) {
      alert('Agent API Key is not set');
      return '';
    }

    return `${endpoint}/ws/avatar?api_key=${this.agentApiKey}`;
  }
}

// Profiles is the list of profiles
export class Profiles {
  public currentProfileId: string;
  public profiles: Profile[] = [];
  public currentProfile: Profile;

  constructor() {
    this.init();

    this.migrateFromOldProfile();

    this.currentProfileId = localStorage.getItem('currentProfileId') || '';

    if (this.profiles.length === 1) {
      this.currentProfileId = this.profiles[0].id;
      this.save();
    }

    if (!this.currentProfileId) {
      this.currentProfileId = this.profiles[0].id;
      this.save();
    }

    this.currentProfile = this.find(this.currentProfileId) || this.profiles[0];

    if (!this.currentProfile?.agentApiUrl) {
      this.currentProfile!.agentApiUrl = DEFAULT_AGENT_API_URL;
      this.save();
    }
  }

  clone() {
    const profile = this.currentProfile;
    if (!profile) {
      return;
    }

    const newProfile = new Profile();

    for (const key in profile) {
      newProfile.setProperty(
        key as keyof Profile,
        profile[key as keyof Profile],
      );
    }

    newProfile.id = uuidv4();
    newProfile.name = `${profile.name} (Clone)`;

    this.profiles.push(newProfile);

    this.switch(newProfile);
  }

  init() {
    const jsonData = JSON.parse(localStorage.getItem('profiles') || '[]');

    for (const profile of jsonData) {
      const p = new Profile();

      if (!ASSISTANT_TYPES.includes(profile['assistantType'])) {
        profile['assistantType'] = ASSISTANT_TYPE_DEFAULT;
      }

      for (const key in profile) {
        p.setProperty(key as keyof Profile, profile[key]);
      }

      p.isAssistant = p.assistantType === ASSISTANT_TYPE_ASSISTANT;
      p.isRealtime = p.assistantType === ASSISTANT_TYPE_REALTIME;
      p.isDeepSeek = p.assistantType === ASSISTANT_TYPE_DEEPSEEK;
      p.isAgentAI = p.assistantType === ASSISTANT_TYPE_AGENT_AI;

      p.buildInPrompt = true;
      p.buildInFunctions = true;

      p.supportedAssistantType =
        supportedAssistantTypes.find((type) => type.value === p.assistantType)
          ?.label || '';

      this.profiles.push(p);
    }
  }

  migrateFromOldProfile() {
    if (this.profiles.length > 0) {
      return;
    }

    const p = new Profile();

    p.id = uuidv4();
    p.name = APP_AGENT;
    p.assistantType = ASSISTANT_TYPE_DEFAULT;
    p.temperature = 0.7;

    p.realtimeEndpoint = localStorage.getItem('endpoint') || '';
    p.realtimeKey = localStorage.getItem('key') || '';

    p.completionTargetUri = localStorage.getItem('completionTargetUri') || '';
    p.completionApiKey = localStorage.getItem('completionApiKey') || '';

    p.deepSeekTargetUri = localStorage.getItem('deepSeekTargetUri') || '';
    p.deepSeekApiKey = localStorage.getItem('deepSeekApiKey') || '';

    p.cogSvcRegion = localStorage.getItem('cogSvcRegion') || '';
    p.cogSvcSubKey = localStorage.getItem('cogSvcSubKey') || '';

    p.dallTargetUri = localStorage.getItem('dallTargetUri') || '';
    p.dallApiKey = localStorage.getItem('dallApiKey') || '';

    p.graphragUrl = localStorage.getItem('graphragUrl') || '';
    p.graphragApiKey = localStorage.getItem('graphragApiKey') || '';
    p.graphragProjectName = localStorage.getItem('graphragProjectName') || '';
    p.graphragAbout = localStorage.getItem('graphragAbout') || '';

    p.prompt = localStorage.getItem('prompt') || '';
    p.promptUrl = localStorage.getItem('promptUrl') || '';

    p.feishuHook = localStorage.getItem('feishuHook') || '';
    p.quoteToken = localStorage.getItem('quoteToken') || '';
    p.newsKey = localStorage.getItem('newsKey') || '';

    p.mxnzpAppId = localStorage.getItem('mxnzpAppId') || '';
    p.mxnzpAppSecret = localStorage.getItem('mxnzpAppSecret') || '';

    p.ttsTargetUri = localStorage.getItem('ttsTargetUri') || '';
    p.ttsApiKey = localStorage.getItem('ttsApiKey') || '';

    p.bingApiKey = localStorage.getItem('bingApiKey') || '';

    p.functions = localStorage.getItem('functions') || '';
    p.functionsUrl = localStorage.getItem('functionsUrl') || '';

    p.buildInPrompt = localStorage.getItem('buildInPrompt') === 'Enable';
    p.buildInFunctions = localStorage.getItem('buildInFunctions') === 'Enable';

    this.profiles.push(p);
    this.save();

    localStorage.removeItem('appName');
    localStorage.removeItem('language');
    localStorage.removeItem('assistant');
    localStorage.removeItem('endpoint');
    localStorage.removeItem('key');
    localStorage.removeItem('completionTargetUri');
    localStorage.removeItem('completionApiKey');
    localStorage.removeItem('deepSeekTargetUri');
    localStorage.removeItem('deepSeekApiKey');
    localStorage.removeItem('cogSvcRegion');
    localStorage.removeItem('cogSvcSubKey');
    localStorage.removeItem('dallTargetUri');
    localStorage.removeItem('dallApiKey');
    localStorage.removeItem('graphragUrl');
    localStorage.removeItem('graphragApiKey');
    localStorage.removeItem('graphragProjectName');
    localStorage.removeItem('graphragAbout');
    localStorage.removeItem('prompt');
    localStorage.removeItem('promptUrl');
    localStorage.removeItem('feishuHook');
    localStorage.removeItem('quoteToken');
    localStorage.removeItem('newsKey');
    localStorage.removeItem('mxnzpAppId');
    localStorage.removeItem('mxnzpAppSecret');
    localStorage.removeItem('ttsTargetUri');
    localStorage.removeItem('ttsApiKey');
    localStorage.removeItem('bingApiKey');
    localStorage.removeItem('functions');
    localStorage.removeItem('functionsUrl');
    localStorage.removeItem('buildInPrompt');
    localStorage.removeItem('buildInFunctions');
    localStorage.removeItem('assistantType');
    localStorage.removeItem('temperature');
    localStorage.removeItem('appIconDark');
    localStorage.removeItem('appIconLight');
    localStorage.removeItem('messages');
  }

  add() {
    const p = new Profile();

    p.id = uuidv4();
    p.name = `${APP_AGENT} ${this.profiles.length + 1}`;
    p.appIconDark = defaultIcon;
    p.appIconLight = defaultIcon;
    p.assistantType = ASSISTANT_TYPE_DEFAULT;

    this.profiles.push(p);
    this.switch(p);
  }

  delete(profile: Profile | undefined) {
    if (!profile) {
      return;
    }

    if (this.profiles.length === 1) {
      alert('You must have at least one profile');
      return;
    }

    this.profiles = this.profiles.filter((p) => p.id !== profile.id);
    this.save();
    this.switch(this.profiles[0]);
  }

  getProfileNamesAsDropdown() {
    return this.profiles
      .map((profile) => ({
        label: profile.name,
        value: profile.id,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }

  find(id: string) {
    return this.profiles.find((profile) => profile.id === id);
  }

  switch(profile: Profile) {
    this.currentProfileId = profile.id;
    this.currentProfile = profile;
    this.save();
  }

  save() {
    localStorage.setItem('currentProfileId', this.currentProfileId);
    localStorage.setItem('profiles', JSON.stringify(this.profiles));
  }
}
