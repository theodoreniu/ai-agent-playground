import { useCallback, useEffect, useRef, useState } from 'react';

import {
  CONNECT_CONNECTED,
  CONNECT_CONNECTING,
  CONNECT_DISCONNECTED,
} from '../lib/const';

import './ConsolePage.scss';
import Camera from '../components/Camera';
import SettingsComponent from '../components/Settings';
import Avatar from '../components/Avatar';
import ConnectButton from '../components/ConnectButton';
import ConnectMessage from '../components/ConnectMessage';
import AgentMessages from '../components/AgentMessages';

import { getOpenAIClient } from '../lib/openai';

import { useContexts } from '../providers/AppProvider';
import { InputBarAgent } from '../components/InputBarAgent';

import BuiltFunctionDisable from '../components/BuiltFunctionDisable';
import { Profiles } from '../lib/Profiles';
import {
  clearAgentMessages,
  getAgentSessions,
  createAgentSession,
  getSessionStates,
} from '../lib/agentApi';
import { AgentMessageType } from '../types/AgentMessageType';
import { LlmMessage } from '../components/AgentMessage';
import axios from 'axios';

export function ConsolePageAgent() {
  const {
    threadRef,
    threadJobRef,
    setThreadJob,
    connectStatus,
    setConnectStatus,
    connectMessage,
    setConnectMessage,
    camera_on_handler,
  } = useContexts();

  const [agentMessages, setAgentMessages] = useState<AgentMessageType[]>([]);
  const [agentRunning, setAgentRunning] = useState(false);
  const agentRunningRef = useRef(false);
  useEffect(() => {
    agentRunningRef.current = agentRunning;
  }, [agentRunning]);

  const [sessionStates, setSessionStates] = useState<any>({});
  const sessionStatesRef = useRef<any>({});
  useEffect(() => {
    sessionStatesRef.current = sessionStates;
  }, [sessionStates]);

  const [sessionId, setSessionId] = useState<string>('');
  const sessionIdRef = useRef<string>(sessionId);

  const [streamBuffer, setStreamBuffer] = useState<string>('');

  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    sessionIdRef.current = sessionId;
    if (sessionIdRef.current) {
      if (!ws.current) {
        const profile = new Profiles().currentProfile;

        const sse = new EventSource(profile.getAgentSseUrl());
        sse.onmessage = (event) => {
          console.log(event.data);
        };
        sse.onerror = (event) => {
          console.error(event);
        };
        sse.onopen = (event) => {
          console.log('sse open', event);
        };

        ws.current = new WebSocket(profile.getAgentWsUrl(sessionId));

        ws.current.onmessage = (event) => {
          const messages: AgentMessageType[] | any = JSON.parse(event.data);

          if (!Array.isArray(messages)) {
            setStreamBuffer((prev) => {
              return `${prev}${messages?.delta}`;
            });
            return;
          }

          console.log('messages', messages);

          setAgentMessages((prevMessages: AgentMessageType[]) => {
            const newMessages = [...prevMessages];
            for (const message of messages) {
              const index = newMessages.findIndex((m) => m.id === message.id);
              if (index !== -1) {
                newMessages[index] = message;
              } else {
                newMessages.push(message);
              }
            }
            return newMessages;
          });
        };

        ws.current.onclose = (event) => {
          console.log('WebSocket已关闭:', event.code, event.reason);
        };

        ws.current.onerror = (event) => {
          console.error('WebSocket遇到错误:', event);
        };
      }

      // get session states
      (async () => {
        const states = await getSessionStates(sessionIdRef.current);
        setSessionStates(states);
      })();
    }
  }, [sessionId]);

  const setupSession = async () => {
    try {
      const sessions: any = await getAgentSessions();

      if (sessions.length === 0) {
        setSessionId(await createAgentSession());
      } else {
        setSessionId(sessions[0].id);
      }
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.detail || error.message);
      }
      throw error;
    }
  };

  const clearMessages = async () => {
    await clearAgentMessages(sessionIdRef.current);
    setAgentMessages([]);
  };

  const stopCurrentStreamJob = async () => {
    if (!threadJobRef.current) {
      return;
    }

    console.log('stopCurrentStreamJob:', threadJobRef.current);

    try {
      const cancelJob = await getOpenAIClient().beta.threads.runs.cancel(
        threadRef.current?.id,
        threadJobRef.current?.id,
      );
      console.log('cancelJob', cancelJob);
    } catch (error) {
      console.log('cancelJob error', JSON.stringify(error));
    }

    setThreadJob(null);
  };

  const sendMessageUser = async (text: string) => {
    await sendMessage({
      type: 'user_input',
      role: 'user',
      content: text,
    });
  };

  useEffect(() => {
    if (agentMessages.length === 0) {
      return;
    }

    const lastMessage = agentMessages[agentMessages.length - 1];
    if (!lastMessage.block_session) {
      return;
    }

    const msg: LlmMessage = lastMessage?.content;

    if (msg?.type !== 'function_call') {
      return;
    }

    const call_id = msg.call_id || '';

    if (
      lastMessage?.need_approve &&
      (lastMessage?.approve_status === 0 || lastMessage?.approve_status === 2)
    ) {
      return;
    }

    if (msg?.name === 'camera_on_or_off') {
      const args = JSON.parse(msg?.arguments || '{}');
      const res = camera_on_handler(args);

      sendMessage({
        type: 'function_call_output',
        call_id: call_id,
        output: JSON.stringify(res),
      });

      // await updateSessionStates(
      //   sessionIdRef.current,
      //   'camera_status',
      //   msg?.arguments,
      // );

      console.log(res);
    }
  }, [agentMessages, camera_on_handler]);

  const sendMessage = async (message: any) => {
    setAgentRunning(true);
    setStreamBuffer('');

    if (!sessionIdRef.current) {
      console.error('Session not found');
      return;
    }

    // may need to add a check to see if the thread is already created
    try {
      ws.current?.send(JSON.stringify(message));
    } catch (error) {
      console.error('sendAssistantMessage error', JSON.stringify(error));
    }

    setAgentRunning(false);
  };

  const connectConversation = useCallback(async () => {
    setAgentRunning(true);
    try {
      setConnectStatus(CONNECT_CONNECTING);
      setConnectMessage('Creating Session...');
      await setupSession();
      setConnectStatus(CONNECT_CONNECTED);
      setConnectMessage('');
    } catch (error: any) {
      setConnectStatus(CONNECT_DISCONNECTED);
      const profiles = new Profiles();
      const agentApiUrl = profiles.currentProfile?.agentApiUrl;
      setConnectMessage(`${error.message} with ${agentApiUrl}`);
    }
    setAgentRunning(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Render the application
   */
  return (
    <>
      <div className="content-logs container_bg">
        <div className="content-block conversation">
          <div className="content-block-body" data-conversation-content>
            <ConnectMessage connectMessage={connectMessage} />

            <AgentMessages
              sendMessage={sendMessage}
              streamBuffer={streamBuffer}
              connectStatus={connectStatus}
              messages={agentMessages}
            />
          </div>

          <InputBarAgent
            setMessagesAssistant={setAgentMessages}
            setAgentRunning={setAgentRunning}
            sendAgentMessage={sendMessageUser}
            stopCurrentStreamJob={stopCurrentStreamJob}
            agentRunning={agentRunning}
            messages={agentMessages}
            clearMessages={clearMessages}
          />
        </div>
      </div>

      <div className="content-right">
        <BuiltFunctionDisable />

        <Avatar />

        <Camera />

        <SettingsComponent connectStatus={connectStatus} />

        <ConnectButton
          connectStatus={connectStatus}
          connectConversation={connectConversation}
        />
      </div>
    </>
  );
}
