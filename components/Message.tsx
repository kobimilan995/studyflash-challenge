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
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Markdown from 'react-native-markdown-display';

interface MessageProps {
  message: UIMessage;
  isStreaming?: boolean;
  onLike?: () => void;
  onDislike?: () => void;
  onCopy?: () => void;
}

const { width: screenWidth } = Dimensions.get('window');

export function Message({
  message,
  isStreaming = false,
  onLike,
  onDislike,
  onCopy,
}: MessageProps) {
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

  const markdownStyles = {
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

// Weather Widget Component
function WeatherWidget({ data }: { data: any }) {
  const { colors } = useTheme();

  // Extract the actual weather data from the nested structure
  const weatherData = data.output || data;
  const location = weatherData.location || 'Unknown';

  // Convert Fahrenheit to Celsius for display
  const celsius = Math.round(((weatherData.temperature - 32) * 5) / 9);
  const condition = weatherData.condition || 'Mostly cloudy';
  const high = weatherData.high || Math.round(celsius + 4);
  const low = weatherData.low || Math.round(celsius - 4);

  const styles = createWeatherWidgetStyles();

  return (
    <View style={styles.container}>
      {/* Header with temperature and condition */}
      <View style={styles.header}>
        <Text style={styles.temperature}>{celsius}°C</Text>
        <Text style={styles.weatherIcon}>↗</Text>
        <Text style={styles.condition}>{condition}</Text>
      </View>

      {/* Location */}
      <Text style={styles.location}>
        {location.charAt(0).toUpperCase() + location.slice(1)}, Serbia
      </Text>

      {/* Day row */}
      <View style={styles.dayRow}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.dayIcon}>☁</Text>
          <Text style={styles.day}>Friday</Text>
        </View>
        <Text style={styles.dayTemps}>
          {high}° {low}°
        </Text>
      </View>

      {/* Description */}
      <Text style={styles.description}>
        Here&apos;s the weather in{' '}
        {location.charAt(0).toUpperCase() + location.slice(1)} right now:
      </Text>

      {/* Details */}
      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.detailText}>
            Conditions: {condition}, around {celsius} °C
          </Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.detailText}>
            Later: Expect some showers this evening, then cloudy overnight with
            temperatures gradually dropping to about 14-16 °C
          </Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.detailText}>
            Early tomorrow morning: Rain is likely, with lows around 14°C
          </Text>
          <TouchableOpacity style={styles.expandButton}>
            <Text style={{ fontSize: 12, color: colors.textSecondary }}>⌄</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// Style functions
function createMessageStyles({ colors, isUser, maxWidth }: { colors: any; isUser: boolean; maxWidth: number }) {
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

function createWeatherWidgetStyles() {
  return StyleSheet.create({
    container: {
      backgroundColor: '#ffffff',
      borderRadius: 12,
      padding: 16,
      marginVertical: 8,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    temperature: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#353740',
      marginRight: 8,
    },
    weatherIcon: {
      fontSize: 16,
      marginRight: 8,
      color: '#6e6e80',
    },
    condition: {
      fontSize: 14,
      color: '#6e6e80',
      flex: 1,
    },
    location: {
      fontSize: 12,
      color: '#8e8ea0',
      marginBottom: 12,
    },
    dayRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    day: {
      fontSize: 14,
      color: '#353740',
      fontWeight: '500',
    },
    dayIcon: {
      fontSize: 12,
      marginRight: 4,
      color: '#6e6e80',
    },
    dayTemps: {
      fontSize: 14,
      color: '#6e6e80',
    },
    description: {
      fontSize: 14,
      color: '#353740',
      marginBottom: 8,
      lineHeight: 20,
    },
    details: {
      marginTop: 8,
    },
    detailItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 4,
    },
    bullet: {
      fontSize: 14,
      color: '#6e6e80',
      marginRight: 8,
      marginTop: 2,
    },
    detailText: {
      fontSize: 14,
      color: '#6e6e80',
      flex: 1,
      lineHeight: 20,
    },
    expandButton: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: '#f7f7f8',
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 8,
    },
  });
}
