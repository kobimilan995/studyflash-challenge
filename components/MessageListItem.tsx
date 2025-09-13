import { useTheme } from '@/hooks/useTheme';
import { UIMessage } from 'ai';
import React from 'react';
import { View } from 'react-native';
import { Message } from './Message';
import { MessageSuggestions } from './MessageSuggestions';
import { TypingIndicator } from './TypingIndicator';

export interface MessageListItemType {
  id: string;
  type: 'message' | 'suggestions' | 'typing' | 'error';
  data?: UIMessage | string | Error;
}

interface MessageListItemProps {
  item: MessageListItemType;
  onSuggestionPress?: (suggestion: string) => void;
}

export function MessageListItem({
  item,
  onSuggestionPress,
}: MessageListItemProps) {
  const { colors } = useTheme();

  switch (item.type) {
    case 'message':
      return <Message key={item.id} message={item.data as UIMessage} />;

    case 'suggestions':
      return (
        <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
          <MessageSuggestions
            onSuggestionPress={onSuggestionPress || (() => {})}
          />
        </View>
      );

    case 'typing':
      return <TypingIndicator />;

    case 'error':
      return (
        <View
          style={{
            paddingHorizontal: 16,
            paddingVertical: 8,
            backgroundColor: colors.error + '20',
            marginHorizontal: 16,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: colors.error + '40',
          }}
        >
          <Message
            key={item.id}
            message={{
              id: 'error-message',
              role: 'assistant',
              parts: [
                {
                  type: 'text',
                  text:
                    (item.data as Error)?.message ||
                    'Something went wrong. Please try again.',
                },
              ],
            }}
          />
        </View>
      );

    default:
      return null;
  }
}
