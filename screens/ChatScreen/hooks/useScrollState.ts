import { UIMessage } from 'ai';
import { useEffect, useState } from 'react';

interface UseScrollStateProps {
  messages: UIMessage[];
}

export function useScrollState({ messages }: UseScrollStateProps) {
  const [userScrolled, setUserScrolled] = useState(false);

  // Reset userScrolled when user sends a new message
  useEffect(() => {
    if (messages.length > 0 && messages[messages.length - 1].role === 'user') {
      setUserScrolled(false);
    }
  }, [messages.length]);

  const handleScroll = (event: any) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const isAtBottom =
      contentOffset.y + layoutMeasurement.height >= contentSize.height - 20;
    setUserScrolled(!isAtBottom);
  };

  return {
    userScrolled,
    handleScroll,
  };
}
