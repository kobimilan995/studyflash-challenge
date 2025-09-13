import { StyleSheet } from 'react-native';

interface ChatScreenStylesProps {
  colors: {
    background: string;
    error: string;
  };
}

export const createChatScreenStyles = ({ colors }: ChatScreenStylesProps) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollView: {
      flex: 1,
    },
    contentContainer: {
      paddingBottom: 20,
    },
    suggestionsContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 40,
      backgroundColor: colors.background,
    },
    errorContainer: {
      padding: 16,
      backgroundColor: colors.error + '20',
      margin: 16,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.error,
    },
    errorText: {
      color: colors.error,
      fontSize: 14,
      textAlign: 'center',
    },
  });
