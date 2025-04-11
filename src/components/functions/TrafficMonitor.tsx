import React, { useEffect, useState } from 'react';
import { X } from 'react-feather';
import { Activity } from 'react-feather';
import { useContexts } from '../../providers/AppProvider';
import { CONNECT_CONNECTED } from '../../lib/const';
import { avgLatency, calculatePercentiles } from '../../lib/helper';
import { TableSheet } from '../../types/Table';
import WithFade from '../WithFade';
import { modalStyles } from '../../styles/modalStyles';
import { Profiles } from '../../lib/Profiles';

const TrafficMonitor: React.FC = () => {
  const [isShow, setIsShow] = useState(false);

  const {
    firstTokenLatencyArray,
    tokenLatencyArray,
    connectStatus,
    isNightMode,
    inputTokens,
    inputTextTokens,
    inputAudioTokens,
    outputTokens,
    outputTextTokens,
    outputAudioTokens,
  } = useContexts();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsShow(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const importModalStyles = modalStyles({ isNightMode });

  const firstTokenLatencyLast =
    firstTokenLatencyArray.length > 0
      ? firstTokenLatencyArray[firstTokenLatencyArray.length - 1]
      : 0;
  const tokenLatencyLast =
    tokenLatencyArray.length > 0
      ? tokenLatencyArray[tokenLatencyArray.length - 1]
      : 0;

  const styles = {
    img: {
      width: '100%',
      height: 'auto',
    } as React.CSSProperties,
    tables: {
      padding: '5px',
      flexWrap: 'wrap',
      gap: '5px',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      borderRadius: '4px',
    } as React.CSSProperties,
    table: {
      borderCollapse: 'collapse',
      fontWeight: 'bold',
    } as React.CSSProperties,
    tablesDashboard: {
      padding: '20px',
      flexWrap: 'wrap',
      gap: '25px',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    } as React.CSSProperties,
    tableDashboard: {
      border: '1px solid #ccc',
      padding: '10px',
      minWidth: '170px',
      marginTop: '10px',
    } as React.CSSProperties,
    key: {
      textAlign: 'right',
      margin: '0',
      padding: '0',
    } as React.CSSProperties,
    value: {
      color: 'green',
      textAlign: 'left',
      float: 'left',
      margin: '0',
      padding: '0',
      marginLeft: '5px',
    } as React.CSSProperties,
    unit: {
      textAlign: 'left',
      paddingLeft: '5px',
    } as React.CSSProperties,
  };

  const TableRender = ({
    style,
    table,
  }: {
    style: React.CSSProperties;
    table: TableSheet;
  }) => {
    return (
      <div>
        {table.name && <div>{table.name}</div>}
        <div>
          <table key={table.name} style={style}>
            <tbody>
              {table.items.map((item, idx) => (
                <tr key={`${table.name}-${idx}`}>
                  <td style={styles.key}>{item.key}</td>
                  <td style={styles.value}>{item.value}</td>
                  <td style={styles.unit}>{item?.unit || ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const ShowTopBar = ({
    firstTokenLatencyArray,
    tokenLatencyArray,
  }: {
    firstTokenLatencyArray: number[];
    tokenLatencyArray: number[];
  }) => {
    if (connectStatus !== CONNECT_CONNECTED) {
      return null;
    }

    const table1: TableSheet = {
      name: '',
      items: [
        { key: 'Request', value: firstTokenLatencyArray.length.toString() },
        { key: 'Response', value: tokenLatencyArray.length.toString() },
      ],
    };

    const table2: TableSheet = {
      name: '',
      items: [
        {
          key: 'Input Tokens',
          value: inputTokens.toString(),
        },
        { key: 'Output Tokens', value: outputTokens.toString() },
      ],
    };

    const table3: TableSheet = {
      name: '',
      items: [
        {
          key: 'First Token',
          value: firstTokenLatencyLast.toString(),
          unit: 'ms',
        },
        { key: 'Next Token', value: tokenLatencyLast.toString(), unit: 'ms' },
      ],
    };

    return (
      <div style={styles.tables} className="traffic_monitor">
        <TableRender style={styles.table} table={table1} />
        <TableRender style={styles.table} table={table2} />
        <TableRender style={styles.table} table={table3} />
      </div>
    );
  };

  const ShowTrafficMonitor = ({
    firstTokenLatencyArray,
    tokenLatencyArray,
  }: {
    firstTokenLatencyArray: number[];
    tokenLatencyArray: number[];
  }) => {
    if (connectStatus !== CONNECT_CONNECTED) {
      return null;
    }

    if (!isShow) {
      return null;
    }

    const profiles = new Profiles();

    console.log('ShowTrafficMonitor Render');

    const firstTokenLatencyMin =
      firstTokenLatencyArray.length > 0
        ? Math.min(...firstTokenLatencyArray)
        : 0;
    const firstTokenLatencyMax =
      firstTokenLatencyArray.length > 0
        ? Math.max(...firstTokenLatencyArray)
        : 0;
    const firstTokenLatencyAvg =
      firstTokenLatencyArray.length > 0
        ? avgLatency(firstTokenLatencyArray)
        : 0;
    const firstTokenLatencyPercentiles = calculatePercentiles(
      firstTokenLatencyArray,
    );
    const firstTokenLatencyP50 = firstTokenLatencyPercentiles['P50'];
    const firstTokenLatencyP90 = firstTokenLatencyPercentiles['P90'];
    const firstTokenLatencyP95 = firstTokenLatencyPercentiles['P95'];
    const firstTokenLatencyP99 = firstTokenLatencyPercentiles['P99'];

    const tokenLatencyMin =
      tokenLatencyArray.length > 0 ? Math.min(...tokenLatencyArray) : 0;
    const tokenLatencyMax =
      tokenLatencyArray.length > 0 ? Math.max(...tokenLatencyArray) : 0;
    const tokenLatencyAvg =
      tokenLatencyArray.length > 0 ? avgLatency(tokenLatencyArray) : 0;
    const tokenLatencyPercentiles = calculatePercentiles(tokenLatencyArray);
    const tokenLatencyP50 = tokenLatencyPercentiles['P50'];
    const tokenLatencyP90 = tokenLatencyPercentiles['P90'];
    const tokenLatencyP95 = tokenLatencyPercentiles['P95'];
    const tokenLatencyP99 = tokenLatencyPercentiles['P99'];

    const timesTable: TableSheet = {
      name: 'Times',
      items: [
        { key: 'Request:', value: firstTokenLatencyArray.length.toString() },
        { key: 'Response:', value: tokenLatencyArray.length.toString() },
        { key: ':', value: '' },
        { key: ':', value: '' },
        { key: ':', value: '' },
        { key: ':', value: '' },
        { key: ':', value: '' },
        { key: ':', value: '' },
      ],
    };

    const tokensTable: TableSheet = {
      name: 'Tokens',
      items: profiles.currentProfile?.isRealtime
        ? [
            {
              key: 'Total Tokens:',
              value: (inputTokens + outputTokens).toString(),
            },
            { key: 'Intput Tokens:', value: inputTokens.toString() },
            { key: 'Input Text Tokens:', value: inputTextTokens.toString() },
            { key: 'Input Audio Tokens:', value: inputAudioTokens.toString() },
            { key: 'Output Tokens:', value: outputTokens.toString() },
            { key: 'Output Text Tokens:', value: outputTextTokens.toString() },
            {
              key: 'Output Audio Tokens:',
              value: outputAudioTokens.toString(),
            },
            { key: ':', value: '' },
          ]
        : [
            {
              key: 'Total Tokens:',
              value: (inputTokens + outputTokens).toString(),
            },
            { key: 'Intput Tokens:', value: inputTokens.toString() },
            { key: 'Output Tokens:', value: outputTokens.toString() },
            { key: ':', value: '' },
            { key: ':', value: '' },
            { key: ':', value: '' },
            { key: ':', value: '' },
            { key: ':', value: '' },
          ],
    };

    const firstTokenLatencyTable: TableSheet = {
      name: 'First Token Latency',
      items: [
        { key: 'Min:', value: firstTokenLatencyMin.toString(), unit: 'ms' },
        { key: 'Max:', value: firstTokenLatencyMax.toString(), unit: 'ms' },
        { key: 'Avg:', value: firstTokenLatencyAvg.toString(), unit: 'ms' },
        { key: 'P50:', value: firstTokenLatencyP50.toString(), unit: 'ms' },
        { key: 'P90:', value: firstTokenLatencyP90.toString(), unit: 'ms' },
        { key: 'P95:', value: firstTokenLatencyP95.toString(), unit: 'ms' },
        { key: 'P99:', value: firstTokenLatencyP99.toString(), unit: 'ms' },
        { key: 'Last:', value: firstTokenLatencyLast.toString(), unit: 'ms' },
      ],
    };

    const tokenLatencyTable: TableSheet = {
      name: 'Token Latency',
      items: [
        { key: 'Min:', value: tokenLatencyMin.toString(), unit: 'ms' },
        { key: 'Max:', value: tokenLatencyMax.toString(), unit: 'ms' },
        { key: 'Avg:', value: tokenLatencyAvg.toString(), unit: 'ms' },
        { key: 'P50:', value: tokenLatencyP50.toString(), unit: 'ms' },
        { key: 'P90:', value: tokenLatencyP90.toString(), unit: 'ms' },
        { key: 'P95:', value: tokenLatencyP95.toString(), unit: 'ms' },
        { key: 'P99:', value: tokenLatencyP99.toString(), unit: 'ms' },
        { key: 'Last:', value: tokenLatencyLast.toString(), unit: 'ms' },
      ],
    };

    return (
      <div style={importModalStyles.backdrop}>
        <div
          style={{ ...importModalStyles.modal, maxWidth: '950px' }}
          className={'modal'}
        >
          <div style={importModalStyles.header}>
            <h2>Traffic Monitor</h2>
            <button
              key="close"
              onClick={() => setIsShow(false)}
              style={importModalStyles.closeBtn}
            >
              <X />
            </button>
          </div>

          <div style={styles.tablesDashboard}>
            <TableRender style={styles.tableDashboard} table={timesTable} />
            <TableRender style={styles.tableDashboard} table={tokensTable} />
            <TableRender
              style={styles.tableDashboard}
              table={firstTokenLatencyTable}
            />
            <TableRender
              style={styles.tableDashboard}
              table={tokenLatencyTable}
            />
          </div>
        </div>
      </div>
    );
  };

  if (connectStatus !== CONNECT_CONNECTED) {
    return null;
  }

  return (
    <>
      <ShowTrafficMonitor
        firstTokenLatencyArray={firstTokenLatencyArray}
        tokenLatencyArray={tokenLatencyArray}
      />

      <WithFade in={connectStatus === CONNECT_CONNECTED}>
        <span onClick={() => setIsShow(true)}>
          <ShowTopBar
            firstTokenLatencyArray={firstTokenLatencyArray}
            tokenLatencyArray={tokenLatencyArray}
          />
          <Activity />
        </span>
      </WithFade>
    </>
  );
};

export default TrafficMonitor;
