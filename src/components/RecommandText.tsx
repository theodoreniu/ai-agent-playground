import { useContexts } from '../providers/AppProvider';
import './InputBar.scss';

export function RecommandText({
  handleInputButtonClick,
  messages,
}: {
  handleInputButtonClick: (message: string) => void;
  messages: string[];
}) {
  const { isNightMode } = useContexts();

  const styles = {
    input_button_group: {
      display: 'flex',
      gap: '5px',
      margin: '8px 18px',
      padding: '0px',
    },
    input_button: {
      backgroundColor: isNightMode
        ? 'rgba(0, 0, 0, 0.3)'
        : 'rgba(255, 255, 255, 0.4)',

      border: 'none',
      padding: '3px 4px',
      fontSize: '12px',
      borderRadius: '3px',
      cursor: 'pointer',
    },
  };

  return (
    <div style={styles.input_button_group}>
      {messages.map((text) => (
        <button
          style={{
            ...styles.input_button,
          }}
          onClick={() => handleInputButtonClick(text)}
          key={text}
        >
          {text}
        </button>
      ))}
    </div>
  );
}
