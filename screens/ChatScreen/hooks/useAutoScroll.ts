import { FlashListRef } from '@shopify/flash-list';
import { UIMessage } from 'ai';
import React, { useCallback, useEffect, useRef } from 'react';
import { MessageListItemType } from '../../../components/MessageListItem';
import { scrollFlashListToBottom, scrollFlashListToBottomImmediate } from '../../../utils';

interface UseAutoScrollProps {
  messages: UIMessage[];
  isLoading: boolean;
  userScrolled: boolean;
  scrollViewRef: React.RefObject<FlashListRef<MessageListItemType> | null>;
}

export function useAutoScroll({
  messages,
  isLoading,
  userScrolled,
  scrollViewRef,
}: UseAutoScrollProps) {
  const lastMessageCountRef = useRef(0);
  const lastAssistantMessageIdRef = useRef<string | null>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Scroll to bottom function using utility method
  const scrollToBottom = useCallback(() => {
    scrollFlashListToBottom(scrollViewRef, messages.length, true);
  }, [scrollViewRef, messages.length]);

  // Scroll to bottom without animation (for streaming)
  const scrollToBottomImmediate = useCallback(() => {
    scrollFlashListToBottomImmediate(scrollViewRef, messages.length);
  }, [scrollViewRef, messages.length]);

  // Auto-scroll to bottom when new messages arrive or during streaming
  useEffect(() => {
    if (!scrollViewRef.current) {
      return;
    }

    const currentMessageCount = messages.length;
    const lastMessage = messages[messages.length - 1];
    const isNewMessage = currentMessageCount > lastMessageCountRef.current;
    const isAssistantMessage = lastMessage?.role === 'assistant';
    const isStreaming = isLoading && isAssistantMessage;
    const isNewAssistantMessage = isAssistantMessage &&
      lastMessage?.id !== lastAssistantMessageIdRef.current;


    // Update refs
    lastMessageCountRef.current = currentMessageCount;
    if (isAssistantMessage) {
      lastAssistantMessageIdRef.current = lastMessage?.id || null;
    }

    // Auto-scroll conditions:
    // 1. New message added (user or assistant)
    // 2. Assistant is streaming (isLoading && assistant message)
    // 3. New assistant message started
    if (isNewMessage || isStreaming || isNewAssistantMessage) {
      // Clear any existing timeouts/intervals
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      // For streaming messages, be more aggressive about scrolling
      if (isStreaming) {
        // Immediate scroll for streaming
        setTimeout(() => scrollToBottomImmediate(), 50);

        // Set up interval for continuous scrolling during streaming
        // Use shorter interval and don't check userScrolled during streaming
        intervalRef.current = setInterval(() => {
          if (scrollViewRef.current) {
            scrollToBottomImmediate();
          }
        }, 100) as unknown as NodeJS.Timeout; // Scroll every 100ms during streaming

        // Clean up interval when streaming stops
        scrollTimeoutRef.current = setTimeout(() => {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        }, 3000) as unknown as NodeJS.Timeout; // Longer timeout for streaming
      } else if (!userScrolled) {
        // For non-streaming messages, use a delayed scroll to ensure content is rendered
        setTimeout(() => scrollToBottom(), 100);
      }
    }
  }, [messages, isLoading, userScrolled, scrollViewRef, scrollToBottom, scrollToBottomImmediate]);

  // Cleanup timeouts and intervals on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Reset scroll tracking when user manually scrolls
  useEffect(() => {
    if (userScrolled) {
      // Clear any pending scroll operations when user takes control
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }, [userScrolled]);

  // Additional effect to force scroll during streaming even if userScrolled is true
  useEffect(() => {
    if (isLoading && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'assistant') {
        // Force scroll every 2 seconds during streaming to ensure we stay at bottom
        const forceScrollInterval = setInterval(() => {
          if (scrollViewRef.current && isLoading) {
            scrollToBottomImmediate();
          }
        }, 2000);

        return () => clearInterval(forceScrollInterval);
      }
    }
  }, [isLoading, messages, scrollViewRef, scrollToBottomImmediate]);
}
