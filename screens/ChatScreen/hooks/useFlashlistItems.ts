import { UIMessage } from 'ai';
import { useMemo } from 'react';
import { MessageListItemType } from '../../../components/MessageListItem';

interface UseFlashlistItemsProps {
  messages: UIMessage[];
  isLoading: boolean;
  error?: Error | null;
  showSuggestions: boolean;
}

export function useFlashlistItems({
  messages,
  isLoading,
  error,
  showSuggestions,
}: UseFlashlistItemsProps) {
  const listData = useMemo(() => {
    const data: MessageListItemType[] = [];

    // Add suggestions if needed
    if (showSuggestions) {
      data.push({
        id: 'suggestions',
        type: 'suggestions',
      });
    }

    // Add messages
    messages.forEach(message => {
      data.push({
        id: message.id,
        type: 'message',
        data: message,
      });
    });

    // Add typing indicator
    if (isLoading) {
      data.push({
        id: 'typing',
        type: 'typing',
      });
    }

    // Add error if present
    if (error) {
      data.push({
        id: 'error',
        type: 'error',
        data: error,
      });
    }

    return data;
  }, [messages, isLoading, error, showSuggestions]);

  return {
    listData,
  };
}
