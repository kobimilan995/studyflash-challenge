import { useCallback, useEffect, useRef, useState } from 'react';

interface UseScrollToBottomButtonProps {
  userScrolled: boolean;
  messagesLength: number;
}

export function useScrollToBottomButton({
  userScrolled,
  messagesLength,
}: UseScrollToBottomButtonProps) {
  const [showButton, setShowButton] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastScrollTimeRef = useRef<number>(0);

  // Handle scroll events to determine button visibility
  const handleScrollForButton = useCallback(
    (event: any) => {
      const { contentOffset, contentSize, layoutMeasurement } =
        event.nativeEvent;
      const currentTime = Date.now();

      // Throttle scroll events
      if (currentTime - lastScrollTimeRef.current < 150) {
        return;
      }
      lastScrollTimeRef.current = currentTime;

      // Check if user is at the bottom (with more tolerance for better detection)
      const atBottom =
        contentOffset.y + layoutMeasurement.height >= contentSize.height - 20;

      setIsAtBottom(atBottom);

      // Clear any existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      if (atBottom) {
        // If at bottom, hide button immediately
        setShowButton(false);
      } else if (messagesLength > 1) {
        // Show button if not at bottom and there are messages
        setShowButton(true);
      }
    },
    [userScrolled, messagesLength]
  );

  // Reset button visibility when new messages arrive (but only if auto-scroll is active)
  useEffect(() => {
    // Only hide button when user hasn't scrolled (auto-scroll will handle it)
    if (messagesLength > 0 && !userScrolled) {
      setShowButton(false);
    }
  }, [messagesLength, userScrolled]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Function to manually hide the button (called when scroll-to-bottom is triggered)
  const hideButton = useCallback(() => {
    setShowButton(false);
  }, []);

  return {
    showButton,
    isAtBottom,
    handleScrollForButton,
    hideButton,
  };
}
