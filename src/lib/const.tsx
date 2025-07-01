export const APP_AGENT = 'AI Agent Playground';
export const APP_AGENT_VECTOR_STORE =
  'ai-agent-playground-assistant-vector-store';

export const DEFAULT_AGENT_API_URL = 'https://agent-api.azuretsp.com';

export const ASSISTANT_TYPE_RESPONSES = 'Responses';
export const ASSISTANT_TYPE_ASSISTANT = 'Assistant';
export const ASSISTANT_TYPE_REALTIME = 'Realtime';
export const ASSISTANT_TYPE_REALTIME_WEB_RTC = 'Realtime WebRTC';
export const ASSISTANT_TYPE_DEEPSEEK = 'DeepSeek';
export const ASSISTANT_TYPE_AGENT_AI = 'Agent API';
export const ASSISTANT_TYPE_DEFAULT = ASSISTANT_TYPE_REALTIME;
export const ASSISTANT_TYPES = [
  ASSISTANT_TYPE_RESPONSES,
  ASSISTANT_TYPE_ASSISTANT,
  ASSISTANT_TYPE_REALTIME,
  ASSISTANT_TYPE_REALTIME_WEB_RTC,
  ASSISTANT_TYPE_DEEPSEEK,
  ASSISTANT_TYPE_AGENT_AI,
];

export const SCENE_DEFAULT = 'Default';
export const SCENE_AIR_CONDITIONING = 'Air Conditioning';
export const SCENE_KITCHEN = 'Kitchen';

export const SHORTCUTS = {
  [SCENE_DEFAULT]: [
    'open camera',
    'what is the weather in tokyo?',
    'open avatar',
  ],
  [SCENE_AIR_CONDITIONING]: [
    'turn on air conditioning',
    'turn off air conditioning',
    'set air conditioning to 25 degrees',
  ],
  [SCENE_KITCHEN]: [
    'turn on range hood',
    'turn off range hood',
    'turn on dishwasher',
    'turn off dishwasher',
    'turn on steaming oven',
    'turn off steaming oven',
  ],
};

export const SPEECH_LANGUAGE_ZH_CN = 'zh-CN';
export const SPEECH_LANGUAGE_EN_US = 'en-US';
export const SPEECH_LANGUAGE_EN_GB = 'en-GB';
export const SPEECH_LANGUAGE_VI_VN = 'vi-vn';
export const SPEECH_LANGUAGE_TH_TH = 'th-th';
export const SPEECH_LANGUAGE_JA_JP = 'ja-jp';
export const SPEECH_LANGUAGE_KO_KR = 'ko-kr';
export const SPEECH_LANGUAGE_MS_MY = 'ms-my';
export const SPEECH_LANGUAGE_DE_DE = 'de-DE';
export const SPEECH_LANGUAGE_FR_FR = 'fr-FR';
export const SPEECH_LANGUAGE_ES_ES = 'es-ES';
export const SPEECH_LANGUAGE_DEFAULT = SPEECH_LANGUAGE_ZH_CN;
export const SPEECH_VOICE_WOMAN = 'Woman';
export const SPEECH_VOICE_MAN = 'Man';
export const SPEECH_VOICE_DEFAULT = SPEECH_VOICE_WOMAN;

export const SPEECH_LANGUAGES = [
  SPEECH_LANGUAGE_ZH_CN,
  SPEECH_LANGUAGE_EN_US,
  SPEECH_LANGUAGE_EN_GB,
  SPEECH_LANGUAGE_VI_VN,
  SPEECH_LANGUAGE_TH_TH,
  SPEECH_LANGUAGE_DE_DE,
  SPEECH_LANGUAGE_JA_JP,
  SPEECH_LANGUAGE_KO_KR,
  SPEECH_LANGUAGE_MS_MY,
  SPEECH_LANGUAGE_FR_FR,
  SPEECH_LANGUAGE_ES_ES,
];

export const SPEECH_DEFAULT_HI: Record<string, string> = {
  [SPEECH_LANGUAGE_ZH_CN]: '你好！',
  [SPEECH_LANGUAGE_EN_US]: 'Hi!',
  [SPEECH_LANGUAGE_EN_GB]: 'Hi!',
  [SPEECH_LANGUAGE_VI_VN]: 'Chào!',
  [SPEECH_LANGUAGE_TH_TH]: 'สวัสดี!',
  [SPEECH_LANGUAGE_JA_JP]: 'こんにちは！',
  [SPEECH_LANGUAGE_KO_KR]: '안녕하세요!',
  [SPEECH_LANGUAGE_MS_MY]: 'Halo!',
  [SPEECH_LANGUAGE_DE_DE]: 'Hallo!',
  [SPEECH_LANGUAGE_FR_FR]: 'Bonjour!',
  [SPEECH_LANGUAGE_ES_ES]: '¡Hola!',
};

export const speechLanguageMapWoman: Record<string, string> = {
  [SPEECH_LANGUAGE_ZH_CN]: 'zh-CN-Xiaoxiao:DragonHDFlashLatestNeural',
  [SPEECH_LANGUAGE_EN_US]: 'en-US-AvaMultilingualNeural',
  [SPEECH_LANGUAGE_EN_GB]: 'en-GB-AdaMultilingualNeural',
  [SPEECH_LANGUAGE_VI_VN]: 'vi-VN-HoaiMyNeural',
  [SPEECH_LANGUAGE_TH_TH]: 'th-TH-AcharaNeural',
  [SPEECH_LANGUAGE_JA_JP]: 'ja-JP-NanamiNeural',
  [SPEECH_LANGUAGE_KO_KR]: 'ko-KR-SunHiNeural',
  [SPEECH_LANGUAGE_MS_MY]: 'ms-MY-YasminNeural',
  [SPEECH_LANGUAGE_DE_DE]: 'de-DE-SeraphinaMultilingualNeural',
  [SPEECH_LANGUAGE_FR_FR]: 'fr-FR-VivienneMultilingualNeural',
  [SPEECH_LANGUAGE_ES_ES]: 'es-ES-ArabellaMultilingualNeural',
};

export const speechLanguageMapMan: Record<string, string> = {
  [SPEECH_LANGUAGE_ZH_CN]: 'zh-CN-YunxiNeural',
  [SPEECH_LANGUAGE_EN_US]: 'en-US-AndrewMultilingualNeural',
  [SPEECH_LANGUAGE_EN_GB]: 'en-GB-OllieMultilingualNeural',
  [SPEECH_LANGUAGE_VI_VN]: 'vi-VN-NamMinhNeural',
  [SPEECH_LANGUAGE_TH_TH]: 'th-TH-NiwatNeural',
  [SPEECH_LANGUAGE_JA_JP]: 'ja-JP-Masaru:DragonHDLatestNeural',
  [SPEECH_LANGUAGE_KO_KR]: 'ko-KR-HyunsuNeural',
  [SPEECH_LANGUAGE_MS_MY]: 'ms-MY-OsmanNeural',
  [SPEECH_LANGUAGE_DE_DE]: 'de-DE-FlorianMultilingualNeural',
  [SPEECH_LANGUAGE_FR_FR]: 'fr-FR-RemyMultilingualNeural',
  [SPEECH_LANGUAGE_ES_ES]: 'es-ES-TristanMultilingualNeural',
};

export const SPEECH_METHOD_STREAM = 'Stream';
export const SPEECH_METHOD_COMPLETION = 'Completion';
export const SPEECH_METHOD_DEFAULT = SPEECH_METHOD_COMPLETION;

export const DEEPSEEK_FUNCTION_CALL_ENABLE = 'Enable';
export const DEEPSEEK_FUNCTION_CALL_DISABLE = 'Disable';

export const ALLOW_PROMPT_CHARACTERS = 15000;
export const ALLOW_FUNCTIONS_CHARACTERS = 100000;
export const ALLOW_URL_CHARACTERS = 1024;

export const CAMERA_PHOTO_LIMIT = 50; // gpt limit 50 images
export const CAMERA_PHOTO_INTERVAL_MS = 1000;

export const CAMERA_OFF = 'camera_off';
export const CAMERA_STARTING = 'camera_starting';
export const CAMERA_READY = 'camera_ready';

export const CONNECT_DISCONNECTED = 'connect_disconnected';
export const CONNECT_CONNECTING = 'connect_connecting';
export const CONNECT_CONNECTED = 'connect_connected';
export const NOT_SETTINGS_STATUS = [CONNECT_CONNECTING, CONNECT_CONNECTED];

export const AVATAR_OFF = 'avatar_off';
export const AVATAR_STARTING = 'avatar_starting';
export const AVATAR_READY = 'avatar_ready';

export const fileUploadInstructions = `我已经上传了数据文件，请告诉我你收到了什么内容的文件，只需要简单解释你收到了什么。不要超过30个字。内容在 ----用户已经上传的数据文件开始---- 下面`;
export const fileUploadTooBig = `请告诉用户，你只是一个 Demo，不处理内容过多的文件，请重新上传一个内容少的文件。`;
export const cameraOpen = `请你说你发现摄像头已经进入工作状态，你可以通过摄像头分析实时画面。`;
export const cameraClose = `请你说你发现摄像头已经关闭，关于摄像头画面的记忆已经清除。`;
export const notDisplay = [
  fileUploadInstructions,
  fileUploadTooBig,
  cameraOpen,
  cameraClose,
];

export const products = [
  {
    id: 1,
    name: '快乐套餐',
    price: 199,
    description: '情侣双人餐，可乐，鸡翅，汉堡，炸鸡腿。',
    image: 'products/1.jpg',
  },
  {
    id: 2,
    name: '汉堡',
    price: 99,
    description: '只是一个汉堡。',
    image: 'products/2.jpg',
  },
  {
    id: 3,
    name: '快乐薯条',
    price: 50,
    description: '想上火，来吃薯条！',
    image: 'products/4.jpg',
  },
];

export const demos = [
  {
    name: 'GraphRAG Kit',
    url: 'https://github.com/theodoreniu/graphrag_webui',
    required_password: false,
    description:
      '这是一个使用 GraphRAG 的全生命周期的 WEBUI 解决方案，不需要写代码，只需要操作界面，就能快速构建、测试甚至部署上线基于 GraphRAG 的服务。',
  },
];
