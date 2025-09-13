import { useTheme } from '@/hooks/useTheme';
import { UIMessage } from 'ai';
import React, { useRef } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { ChatHeader } from '../../components/ChatHeader';
import { Composer } from '../../components/Composer';
import { Message } from '../../components/Message';
import { MessageSuggestions } from '../../components/MessageSuggestions';
import { TypingIndicator } from '../../components/TypingIndicator';
import {
  useAutoScroll,
  useChatAnimations,
  useScrollState,
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
  const scrollViewRef = useRef<ScrollView | null>(null);

  // Custom hooks
  const { userScrolled, handleScroll } = useScrollState({ messages });
  const { showSuggestions } = useSuggestionsVisibility({ messages });
  const { fadeAnim, errorAnim } = useChatAnimations({
    messagesLength: messages.length,
    error,
  });

  // Auto-scroll behavior
  useAutoScroll({
    messages,
    isLoading,
    userScrolled,
    scrollViewRef,
  });

  const handleSuggestionPress = (suggestion: string) => {
    onSendMessage(suggestion);
  };

  const handleAttach = () => {
    // Stub action - just log for now
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
          <ScrollView
            ref={scrollViewRef}
            style={styles.scrollView}
            contentContainerStyle={styles.contentContainer}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
          >
            {showSuggestions && (
              <View style={styles.suggestionsContainer}>
                <MessageSuggestions onSuggestionPress={handleSuggestionPress} />
              </View>
            )}

            <Animated.View style={{ opacity: fadeAnim }}>
              {messages.map(message => (
                <Message
                  key={message.id}
                  message={message}
                  isStreaming={false}
                />
              ))}

              {isLoading && <TypingIndicator />}
            </Animated.View>

            {error && (
              <Animated.View
                style={[
                  styles.errorContainer,
                  {
                    opacity: errorAnim,
                    transform: [
                      { scale: errorAnim },
                      { translateY: Animated.multiply(errorAnim, -10) },
                    ],
                  },
                ]}
              >
                <Text style={styles.errorText}>
                  {error.message || 'Something went wrong. Please try again.'}
                </Text>
              </Animated.View>
            )}
          </ScrollView>

          <Composer
            onSend={onSendMessage}
            disabled={isLoading}
            onAttach={handleAttach}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
