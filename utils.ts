import { FlashListRef } from '@shopify/flash-list';
import Constants from 'expo-constants';

export const generateAPIUrl = (relativePath: string) => {
  let origin: string;
  if (!Constants.experienceUrl) {
    origin = 'http://localhost:8081';
  } else {
    origin = Constants.experienceUrl.replace('exp://', 'http://');
  }

  const path = relativePath.startsWith('/') ? relativePath : `/${relativePath}`;

  if (process.env.NODE_ENV === 'development') {
    return origin.concat(path);
  }

  if (!process.env.EXPO_PUBLIC_API_BASE_URL) {
    throw new Error(
      'EXPO_PUBLIC_API_BASE_URL environment variable is not defined'
    );
  }

  return process.env.EXPO_PUBLIC_API_BASE_URL.concat(path);
};

/**
 * Scrolls a FlashList to the bottom using multiple fallback methods
 * @param flashListRef - Reference to the FlashList component
 * @param messagesLength - Number of messages in the list
 * @param animated - Whether to animate the scroll (default: true)
 */
export const scrollFlashListToBottom = <T>(
  flashListRef: React.RefObject<FlashListRef<T> | null>,
  messagesLength: number,
  animated: boolean = true
): void => {
  if (!flashListRef.current || messagesLength === 0) {
    return;
  }

  try {
    // Method 1: scrollToEnd (most reliable for FlashList)
    flashListRef.current.scrollToEnd({ animated });
  } catch {
    try {
      // Method 2: scrollToIndex with last message
      flashListRef.current.scrollToIndex({
        index: messagesLength - 1,
        animated,
        viewPosition: 1, // 1 = bottom of viewport
      });
    } catch {
      try {
        // Method 3: scrollToOffset with large offset
        flashListRef.current.scrollToOffset({
          offset: 999999,
          animated,
        });
      } catch (error) {
        console.warn('All scroll methods failed:', error);
      }
    }
  }
};

/**
 * Scrolls a FlashList to the bottom immediately (without animation)
 * Useful for streaming messages where smooth scrolling isn't needed
 */
export const scrollFlashListToBottomImmediate = <T>(
  flashListRef: React.RefObject<FlashListRef<T> | null>,
  messagesLength: number
): void => {
  scrollFlashListToBottom(flashListRef, messagesLength, false);
};
