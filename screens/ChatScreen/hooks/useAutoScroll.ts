import { UIMessage } from 'ai';
import React, { useEffect, useRef } from 'react';
import { ScrollView } from 'react-native';

interface UseAutoScrollProps {
  messages: UIMessage[];
  isLoading: boolean;
  userScrolled: boolean;
  scrollViewRef: React.RefObject<ScrollView | null>;
}

export function useAutoScroll({
  messages,
  isLoading,
  userScrolled,
  scrollViewRef,
}: UseAutoScrollProps) {
  const lastMessageContentRef = useRef<string>('');

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (!userScrolled && scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length, userScrolled, scrollViewRef]);

  // Auto-scroll during streaming (when assistant is typing)
  useEffect(() => {
    if (!userScrolled && isLoading && messages.length > 0 && scrollViewRef.current) {
      // More frequent scrolling during streaming
      const interval = setInterval(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [isLoading, userScrolled, messages.length, scrollViewRef]);

  // Auto-scroll when message content changes (for streaming)
  useEffect(() => {
    if (messages.length > 0 && !userScrolled && scrollViewRef.current) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'assistant') {
        // Get text content from all text parts
        const textContent = lastMessage.parts
          .filter(part => part.type === 'text')
          .map(part => part.text)
          .join('');

        // If content has changed, scroll to bottom
        if (textContent !== lastMessageContentRef.current) {
          lastMessageContentRef.current = textContent;
          setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
          }, 50);
        }
      }
    }
  }, [messages, userScrolled, scrollViewRef]);
}
