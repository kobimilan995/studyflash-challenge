import { useTheme } from '@/hooks/useTheme';
import { FlashList, FlashListRef } from '@shopify/flash-list';
import { UIMessage } from 'ai';
import React, { useRef } from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { ChatHeader } from '../../components/ChatHeader';
import { Composer } from '../../components/Composer';
import {
  MessageListItem,
  MessageListItemType,
} from '../../components/MessageListItem';
import { ScrollToBottomButton } from '../../components/ScrollToBottomButton';
import { scrollFlashListToBottom } from '../../utils';
import {
  useAutoScroll,
  useChatAnimations,
  useFlashlistItems,
  useScrollState,
  useScrollToBottomButton,
  useSuggestionsVisibility,
} from './hooks';
import { createChatScreenStyles } from './styles';

interface ChatScreenProps {
  messages: UIMessage[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
  error?: Error | null;
}

export function ChatScreen({
  messages,
  isLoading,
  onSendMessage,
  error,
}: ChatScreenProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const flashListRef = useRef<FlashListRef<MessageListItemType>>(null);

  // Custom hooks
  const { userScrolled, handleScroll } = useScrollState({
    messages,
    isLoading,
  });
  const { showSuggestions } = useSuggestionsVisibility({ messages });
  const { listData } = useFlashlistItems({
    messages,
    isLoading,
    error,
    showSuggestions,
  });
  const { showButton, handleScrollForButton, hideButton } = useScrollToBottomButton({
    userScrolled,
    messagesLength: messages.length,
  });

  // Note: errorAnim is available but not currently used in FlashList implementation
  useChatAnimations({
    messagesLength: messages.length,
    error,
  });

  // Auto-scroll behavior
  useAutoScroll({
    messages,
    isLoading,
    userScrolled,
    scrollViewRef: flashListRef,
  });

  const handleSuggestionPress = (suggestion: string) => {
    onSendMessage(suggestion);
  };

  const handleAttach = () => {
    // Stub action - just log for now
  };

  const handleScrollToBottom = () => {
    scrollFlashListToBottom(flashListRef, messages.length, true);
    // Hide the button immediately when clicked
    hideButton();
  };

  // Combined scroll handler for both existing scroll state and button visibility
  const handleCombinedScroll = (event: any) => {
    handleScroll(event);
    handleScrollForButton(event);
  };

  const styles = createChatScreenStyles({ colors });

  return (
    <SafeAreaView style={styles.container}>
      <ChatHeader />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? -insets.bottom : 0}
      >
        <View style={styles.container}>
          <View style={styles.flashListContainer}>
            <FlashList
              ref={flashListRef}
              data={listData}
              renderItem={({ item }) => (
                <MessageListItem
                  item={item}
                  onSuggestionPress={handleSuggestionPress}
                />
              )}
              keyExtractor={item => item.id}
              getItemType={item => item.type}
              onScroll={handleCombinedScroll}
              scrollEventThrottle={16}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.contentContainer}
              maintainVisibleContentPosition={{
                autoscrollToTopThreshold: 0,
              }}
              drawDistance={500}
              removeClippedSubviews={false}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="on-drag"
            />
          </View>

          <Composer
            onSend={onSendMessage}
            disabled={isLoading}
            onAttach={handleAttach}
          />

          <ScrollToBottomButton
            visible={showButton}
            onPress={handleScrollToBottom}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
