import { useContexts } from '../providers/AppProvider';
import { useEffect } from 'react';
import { Sun, Moon } from 'react-feather';

export function NightMode() {
  const { isNightMode, isNightModeRef, setIsNightMode, replaceInstructions } =
    useContexts();

  useEffect(() => {
    isNightModeRef.current = isNightMode;

    if (isNightMode) {
      document.body.classList.add('night-mode');
      replaceInstructions('你的界面现在是白天模式', '你的界面现在是夜间模式');
    } else {
      document.body.classList.remove('night-mode');
      replaceInstructions('你的界面现在是夜间模式', '你的界面现在是白天模式');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNightMode]);

  const toggleNightMode = () => {
    const currentValue = !isNightModeRef.current;
    setIsNightMode(currentValue);
  };

  return null;

  return (
    <span onClick={toggleNightMode}>
      {isNightModeRef.current ? <Moon /> : <Sun />}
    </span>
  );
}
