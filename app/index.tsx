import { ChatScreen } from '@/screens/ChatScreen';
import { generateAPIUrl } from '@/utils';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { fetch as expoFetch } from 'expo/fetch';
import { useEffect, useState } from 'react';

export default function App() {
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);

  const { messages, error, sendMessage, setMessages } = useChat({
    transport: new DefaultChatTransport({
      fetch: expoFetch as unknown as typeof globalThis.fetch,
      api: generateAPIUrl('/api/chat'),
    }),
    onError: error => {
      console.error(error, 'ERROR');
      setIsWaitingForResponse(false);
    },
  });

  const handleSendMessage = (message: string) => {
    setIsWaitingForResponse(true);
    sendMessage({ text: message });
  };

  const handleClearMessages = () => {
    setMessages([]);
    setIsWaitingForResponse(false);
  };

  // Reset waiting state when we get a new assistant message
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];

      if (lastMessage.role === 'assistant') {
        setIsWaitingForResponse(false);
      }
    }
  }, [messages]);

  return (
    <ChatScreen
      messages={messages}
      isLoading={isWaitingForResponse}
      onSendMessage={handleSendMessage}
      onClearMessages={handleClearMessages}
      error={error}
    />
  );
}
