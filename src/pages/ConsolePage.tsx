import './ConsolePage.scss';
import { useContexts } from '../providers/AppProvider';
import { NightMode } from '../components/NightMode';
import Caption from '../components/Caption';
import BingSearchResult from '../components/functions/BingSearchResult';
import PaintingResult from '../components/functions/PaintingResult';
import TrafficMonitor from '../components/functions/TrafficMonitor';
import FunctionsList from '../components/functions/FunctionsList';
import { ConsolePageRealtime } from './ConsolePageRealtime';
import { ConsolePageAssistant } from './ConsolePageAssistant';
import { AlertTriangle } from 'react-feather';
import AboutApp from '../components/AboutApp';
import { ConsolePageDeepSeek } from './ConsolePageDeepSeek';
import GithubLink from '../components/GithubLink';
import { getFunctionsFromUrl, getPromptFromUrl } from '../lib/helper';
import { useEffect, useState } from 'react';
import AppMessage from '../components/AppMessage';
import { Profiles } from '../lib/Profiles';
import defaultIcon from '../static/logomark.svg';
import { ConsolePageAgent } from './ConsolePageAgent';

export function ConsolePage() {
  const { isDebugMode, setIsDebugMode, isNightMode } = useContexts();

  const [profiles] = useState(new Profiles());

  useEffect(() => {
    const timer = setInterval(async () => {
      await getPromptFromUrl();
      await getFunctionsFromUrl();
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    document.title = profiles.currentProfile?.name || '';
  }, [profiles]);

  function IsDebugMode() {
    if (!isDebugMode) {
      return null;
    }

    return (
      <span onClick={() => setIsDebugMode(false)}>
        <AlertTriangle />
      </span>
    );
  }

  const styles = {
    assistantType: {
      fontSize: '12px',
      color: 'white',
      backgroundColor: 'green',
      borderRadius: '5px',
      padding: '2px 5px',
      marginLeft: '0',
      marginTop: '-5px',
    },
    title: {
      fontSize: '30px',
      fontWeight: '500',
    },
    logo: {
      height: '30px',
      borderRadius: '5px',
    },
  };

  /**
   * Render the application
   */
  return (
    <div data-component="ConsolePage">
      <Caption />

      <div className="content-top">
        <div className="content-title">
          <img
            style={styles.logo}
            src={
              isNightMode
                ? profiles.currentProfile?.appIconDark || defaultIcon
                : profiles.currentProfile?.appIconLight || defaultIcon
            }
            alt="logo"
          />
          <h1 style={styles.title}>{profiles.currentProfile?.name}</h1>

          <span style={styles.assistantType}>
            {profiles.currentProfile?.supportedAssistantType}
          </span>

          <a
            href="https://github.com/theodoreniu/ai-agent-playground"
            target="_blank"
            style={{ marginTop: 0, top: 0, display: 'none' }}
          >
            <img
              src="https://img.shields.io/github/v/tag/theodoreniu/ai-agent-playground"
              style={{ width: '100%', height: '20px' }}
              alt="logo"
            />
          </a>
        </div>
        <span className="functions">
          <BingSearchResult />
          <TrafficMonitor />
          <PaintingResult />
          <IsDebugMode />
          <NightMode />
          <FunctionsList />
          <AppMessage />
          <GithubLink />
          <AboutApp />
        </span>
      </div>

      <div className="content-main">
        {profiles.currentProfile?.isRealtime && <ConsolePageRealtime />}
        {profiles.currentProfile?.isAssistant && <ConsolePageAssistant />}
        {profiles.currentProfile?.isDeepSeek && <ConsolePageDeepSeek />}
        {profiles.currentProfile?.isAgentAI && <ConsolePageAgent />}
      </div>
    </div>
  );
}
