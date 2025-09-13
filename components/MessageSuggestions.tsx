import { useTheme } from '@/hooks/useTheme';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface MessageSuggestionsProps {
  onSuggestionPress: (suggestion: string) => void;
}

const suggestions = [
  "Write a creative story about a robot learning to paint",
  "Explain quantum computing in simple terms",
  "Help me plan a healthy meal for the week",
  "What are the latest trends in AI technology?",
  "Create a workout routine for beginners",
  "Write a professional email to my manager",
];

export function MessageSuggestions({ onSuggestionPress }: MessageSuggestionsProps) {
  const { colors, isDark } = useTheme();

  const handleSuggestionPress = (suggestion: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSuggestionPress(suggestion);
  };

  const styles = createMessageSuggestionsStyles({ colors, isDark });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>How can I help you today?</Text>
      <ScrollView
        style={styles.suggestionsContainer}
        showsVerticalScrollIndicator={false}
      >
        {suggestions.map((suggestion, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.suggestion,
              index === suggestions.length - 1 && { marginBottom: 0 }
            ]}
            onPress={() => handleSuggestionPress(suggestion)}
            activeOpacity={0.7}
          >
            <Text style={styles.suggestionText}>{suggestion}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

// Style function
function createMessageSuggestionsStyles({ colors, isDark }: { colors: any; isDark: boolean }) {
  return StyleSheet.create({
    container: {
      paddingHorizontal: 16,
      paddingVertical: 20,
    },
    title: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 16,
      textAlign: 'center',
    },
    suggestionsContainer: {
      // Remove gap as it doesn't work well with ScrollView
    },
    suggestion: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.borderLight,
      shadowColor: isDark ? '#000' : '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: isDark ? 0.3 : 0.1,
      shadowRadius: 2,
      elevation: 1,
    },
    suggestionText: {
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 20,
    },
  });
}
