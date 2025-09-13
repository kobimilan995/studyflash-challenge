import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { UIMessage } from 'ai';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import Markdown from 'react-native-markdown-display';
import { WeatherWidget } from './WeatherWidget';

interface MessageProps {
  message: UIMessage;
  isStreaming?: boolean;
  onLike?: () => void;
  onDislike?: () => void;
  onCopy?: () => void;
}

const { width: screenWidth } = Dimensions.get('window');

export function Message({ message, onLike, onDislike, onCopy }: MessageProps) {
  const { colors } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const [liked, setLiked] = React.useState(false);
  const [disliked, setDisliked] = React.useState(false);

  useEffect(() => {
    // Message mount animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const handleLike = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setLiked(!liked);
    setDisliked(false);
    onLike?.();
  };

  const handleDislike = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setDisliked(!disliked);
    setLiked(false);
    onDislike?.();
  };

  const handleCopy = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const text = message.parts
      .filter(part => part.type === 'text')
      .map(part => part.text)
      .join('');
    await Clipboard.setStringAsync(text);
    onCopy?.();
  };

  const isUser = message.role === 'user';
  const maxWidth = screenWidth * 0.8;

  // Removed timestamp generation for mock

  const styles = createMessageStyles({ colors, isUser, maxWidth });
  const markdownStyles = createMarkdownStyles(colors);

  const renderMessageContent = () => {
    return message.parts.map((part, index) => {
      switch (part.type) {
        case 'text':
          return (
            <Markdown key={`${message.id}-${index}`} style={markdownStyles}>
              {part.text}
            </Markdown>
          );
        case 'tool-weather':
          return <WeatherWidget key={`${message.id}-${index}`} data={part} />;
        default:
          return null;
      }
    });
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.messageWrapper}>
        <View style={styles.messageContent}>
          <View style={styles.messageBubble}>{renderMessageContent()}</View>
        </View>
      </View>

      {!isUser && (
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
            <Ionicons
              name={liked ? 'thumbs-up' : 'thumbs-up-outline'}
              size={16}
              color={liked ? colors.accent : colors.icon}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleDislike}>
            <Ionicons
              name={disliked ? 'thumbs-down' : 'thumbs-down-outline'}
              size={16}
              color={disliked ? colors.error : colors.icon}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleCopy}>
            <Ionicons
              name="volume-high-outline"
              size={16}
              color={colors.icon}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleCopy}>
            <Ionicons name="refresh-outline" size={16} color={colors.icon} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleCopy}>
            <Ionicons name="share-outline" size={16} color={colors.icon} />
          </TouchableOpacity>
        </View>
      )}
    </Animated.View>
  );
}

// Style functions
function createMarkdownStyles(colors: any) {
  return {
    body: {
      color: colors.text,
      fontSize: 16,
      lineHeight: 24,
    },
    code_inline: {
      backgroundColor: colors.surface,
      color: colors.accent,
      paddingHorizontal: 4,
      paddingVertical: 2,
      borderRadius: 4,
      fontSize: 14,
    },
    code_block: {
      backgroundColor: colors.surface,
      color: colors.text,
      padding: 12,
      borderRadius: 8,
      fontSize: 14,
      fontFamily: 'monospace',
    },
    blockquote: {
      borderLeftWidth: 4,
      borderLeftColor: colors.accent,
      paddingLeft: 12,
      marginLeft: 0,
      fontStyle: 'italic',
    },
  };
}

// Style functions
function createMessageStyles({
  colors,
  isUser,
  maxWidth,
}: {
  colors: any;
  isUser: boolean;
  maxWidth: number;
}) {
  return StyleSheet.create({
    container: {
      marginVertical: 8,
      paddingHorizontal: 16,
    },
    messageWrapper: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: isUser ? 'flex-end' : 'flex-start',
    },
    messageContent: {
      flex: 1,
      maxWidth: maxWidth,
    },
    messageBubble: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 18,
      backgroundColor: isUser ? '#f7f7f8' : '#ffffff',
      borderWidth: isUser ? 0 : 1,
      borderColor: '#e5e5e5',
      shadowColor: isUser ? 'transparent' : '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: isUser ? 0 : 0.1,
      shadowRadius: 2,
      elevation: isUser ? 0 : 1,
    },
    messageText: {
      fontSize: 16,
      lineHeight: 24,
      color: colors.text,
    },
    actionsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 8,
      marginLeft: 16,
      opacity: 0.6,
    },
    actionButton: {
      padding: 6,
      marginRight: 4,
      borderRadius: 4,
    },
  });
}

