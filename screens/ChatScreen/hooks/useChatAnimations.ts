import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

interface UseChatAnimationsProps {
  messagesLength: number;
  error?: Error | null;
}

export function useChatAnimations({ messagesLength, error }: UseChatAnimationsProps) {
  const fadeAnim = useRef(
    new Animated.Value(messagesLength === 0 ? 1 : 0)
  ).current;
  const errorAnim = useRef(new Animated.Value(0)).current;

  // Handle fade animation for suggestions
  useEffect(() => {
    if (messagesLength > 0) {
      // Hide suggestions when messages are present
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      // Show suggestions when chat is empty
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [messagesLength, fadeAnim]);

  // Error message animation
  useEffect(() => {
    if (error) {
      Animated.spring(errorAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(errorAnim, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    }
  }, [error, errorAnim]);

  return {
    fadeAnim,
    errorAnim,
  };
}
