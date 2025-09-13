import { UIMessage } from 'ai';
import { useCallback, useEffect, useRef, useState } from 'react';

interface UseScrollStateProps {
  messages: UIMessage[];
  isLoading?: boolean;
}

export function useScrollState({
  messages,
  isLoading = false,
}: UseScrollStateProps) {
  const [userScrolled, setUserScrolled] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastScrollTimeRef = useRef<number>(0);
  const lastContentHeightRef = useRef<number>(0);
  const isUserScrollingRef = useRef<boolean>(false);

  // Reset userScrolled when user sends a new message
  useEffect(() => {
    if (messages.length > 0 && messages[messages.length - 1].role === 'user') {
      setUserScrolled(false);
      isUserScrollingRef.current = false;
    }
  }, [messages]);

  // Auto-reset userScrolled when assistant starts responding
  useEffect(() => {
    if (isLoading && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'assistant') {
        // Reset userScrolled when assistant starts streaming
        setUserScrolled(false);
        isUserScrollingRef.current = false;
      }
    }
  }, [isLoading, messages]);

  // Reset userScrolled when content height changes significantly (new content added)
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'assistant' && isLoading) {
        // During streaming, periodically reset userScrolled to allow auto-scroll
        const resetInterval = setInterval(() => {
          if (isLoading && !isUserScrollingRef.current) {
            setUserScrolled(false);
          }
        }, 500); // Reset every 500ms during streaming

        return () => clearInterval(resetInterval);
      }
    }
  }, [isLoading, messages]);

  const handleScroll = useCallback(
    (event: any) => {
      const { contentOffset, contentSize, layoutMeasurement } =
        event.nativeEvent;
      const currentTime = Date.now();

      // Throttle scroll events to improve performance
      if (currentTime - lastScrollTimeRef.current < 100) {
        return;
      }
      lastScrollTimeRef.current = currentTime;

      // Check if content height has increased significantly (new content added)
      const contentHeightIncreased =
        contentSize.height > lastContentHeightRef.current + 50;
      lastContentHeightRef.current = contentSize.height;

      // More generous threshold for "at bottom" detection
      const isAtBottom =
        contentOffset.y + layoutMeasurement.height >= contentSize.height - 100;

      // Clear any existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      if (isAtBottom) {
        // If user scrolls to bottom, reset userScrolled after a short delay
        // This prevents flickering during streaming
        scrollTimeoutRef.current = setTimeout(() => {
          setUserScrolled(false);
          isUserScrollingRef.current = false;
        }, 200) as unknown as NodeJS.Timeout;
      } else {
        // Only set userScrolled to true if user is actively scrolling
        // Don't set it if content is just growing (streaming)
        if (!contentHeightIncreased || !isLoading) {
          setUserScrolled(true);
          isUserScrollingRef.current = true;
        }
      }
    },
    [isLoading]
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return {
    userScrolled,
    handleScroll,
  };
}
