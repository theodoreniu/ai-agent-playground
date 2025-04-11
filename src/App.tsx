import { ConsolePage } from './pages/ConsolePage';

import './App.scss';
import { AppProvider } from './providers/AppProvider';
import LocalStorageViewer from './pages/LocalStorageViewer';
import Loading from './pages/Loading';
import { GptImagesProvider } from './contexts/GptImagesContext';
import { TrafficDataProvider } from './contexts/TrafficDataContext';
import { useEffect, useState } from 'react';
import { ToolDefinitionType } from '@theodoreniu/realtime-api-beta/dist/lib/client';
import { loadFunctions } from './lib/helper';

function App() {
  const [appKey, setAppKey] = useState<number>(1);
  const [isNightMode, setIsNightMode] = useState<boolean>(false);
  const [opacity, setOpacity] = useState<number>(1);
  const [background, setBackground] = useState<string>('');
  const [loadFunctionsTools] =
    useState<[ToolDefinitionType, Function][]>(loadFunctions());

  // useEffect(() => {
  //   if (background) {
  //     const path = isNightMode ? 'dark' : 'light';
  //     const url = `/images/bg/${path}/${background}.png`;
  //     document.body.style.backgroundImage = `url(${url})`;
  //   }
  // }, [background, isNightMode]);

  useEffect(() => {
    // const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
    //   .matches
    //   ? 'dark'
    //   : 'light';

    // if (systemTheme === 'dark') {
    //   setIsNightMode(true);
    // } else {
    //   setIsNightMode(false);
    // }

    setIsNightMode(true);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const gradientStyle = {
    width: '100vw',
    height: '100vh',
    opacity: opacity,
  };

  return (
    <div
      data-component="App"
      key={appKey}
      className="app-container"
      style={gradientStyle}
    >
      <div className="particles"></div>
      <GptImagesProvider>
        <TrafficDataProvider>
          <AppProvider
            appKey={appKey}
            setAppKey={setAppKey}
            isNightMode={isNightMode}
            setIsNightMode={setIsNightMode}
            loadFunctionsTools={loadFunctionsTools}
            setOpacity={setOpacity}
            setBackground={setBackground}
          >
            <Loading />
            <LocalStorageViewer />
            <ConsolePage />
          </AppProvider>
        </TrafficDataProvider>
      </GptImagesProvider>
    </div>
  );
}

export default App;
