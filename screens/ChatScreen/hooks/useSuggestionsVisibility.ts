import { UIMessage } from 'ai';
import { useEffect, useState } from 'react';

interface UseSuggestionsVisibilityProps {
  messages: UIMessage[];
}

export function useSuggestionsVisibility({ messages }: UseSuggestionsVisibilityProps) {
  const [showSuggestions, setShowSuggestions] = useState(true);

  // Hide suggestions when first message is sent
  useEffect(() => {
    if (messages.length > 0) {
      setShowSuggestions(false);
    } else {
      // Show suggestions when chat is empty
      setShowSuggestions(true);
    }
  }, [messages.length]);

  return {
    showSuggestions,
  };
}
