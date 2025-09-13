import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useRef, useState } from 'react';
import {
  Animated,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ComposerProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
  onAttach?: () => void;
}

const MAX_LINES = 6;
const LINE_HEIGHT = 24;

export function Composer({
  onSend,
  disabled = false,
  placeholder = 'Ask anything',
  onAttach,
}: ComposerProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [text, setText] = useState('');
  const [inputHeight, setInputHeight] = useState(LINE_HEIGHT);
  const [isFocused, setIsFocused] = useState(false);
  const [showSendButton, setShowSendButton] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const sendButtonAnim = useRef(new Animated.Value(0)).current;

  const handleSend = () => {
    if (text.trim() && !disabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onSend(text.trim());
      setText('');
      setInputHeight(LINE_HEIGHT);
    }
  };

  const handleAttach = () => {
    if (!disabled && onAttach) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onAttach();
    }
  };

  const handleTextChange = (newText: string) => {
    setText(newText);

    // Animate send button appearance
    if (newText.trim().length > 0 && !showSendButton) {
      setShowSendButton(true);
      Animated.spring(sendButtonAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    } else if (newText.trim().length === 0 && showSendButton) {
      setShowSendButton(false);
      Animated.spring(sendButtonAnim, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleContentSizeChange = (event: any) => {
    const { height } = event.nativeEvent.contentSize;

    // Calculate height based on line count
    const lineCount = Math.ceil(height / LINE_HEIGHT);
    const newHeight = Math.min(
      Math.max(LINE_HEIGHT, lineCount * LINE_HEIGHT),
      LINE_HEIGHT * MAX_LINES
    );

    setInputHeight(newHeight);
  };

  const handleFocus = () => {
    setIsFocused(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.spring(scaleAnim, {
      toValue: 1.02,
      useNativeDriver: true,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const canSend = text.trim().length > 0 && !disabled;

  const styles = createComposerStyles({ colors, insets, isFocused, canSend, LINE_HEIGHT });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.inputContainer,
          {
            transform: [{ scale: scaleAnim }],
            minHeight: 56,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.attachButton}
          onPress={handleAttach}
          disabled={disabled}
        >
          <Ionicons
            name="add"
            size={20}
            color={disabled ? colors.textMuted : '#666666'}
          />
        </TouchableOpacity>

        <TextInput
          ref={inputRef}
          style={[
            styles.textInput,
            {
              minHeight: LINE_HEIGHT,
              maxHeight: LINE_HEIGHT * MAX_LINES,
            },
          ]}
          value={text}
          onChangeText={handleTextChange}
          onContentSizeChange={handleContentSizeChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          multiline
          editable={!disabled}
          returnKeyType="send"
          onSubmitEditing={handleSend}
          blurOnSubmit={false}
          scrollEnabled={inputHeight >= LINE_HEIGHT * MAX_LINES}
        />

          <Animated.View
            style={[
              styles.sendButton,
              {
                opacity: sendButtonAnim,
                transform: [
                  { scale: sendButtonAnim },
                  { translateX: Animated.multiply(sendButtonAnim, 10) },
                ],
              },
            ]}
          >
            <TouchableOpacity
              style={styles.sendButtonInner}
              onPress={handleSend}
              disabled={!canSend}
            >
              <Ionicons
                name="arrow-up"
                size={18}
                color={canSend ? '#ffffff' : colors.textMuted}
              />
            </TouchableOpacity>
          </Animated.View>

        {disabled && <View style={styles.disabledOverlay} />}
      </Animated.View>
    </View>
  );
}

// Style function
function createComposerStyles({ colors, insets, isFocused, canSend, LINE_HEIGHT }: {
  colors: any;
  insets: any;
  isFocused: boolean;
  canSend: boolean;
  LINE_HEIGHT: number;
}) {
  return StyleSheet.create({
    container: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      paddingBottom: Math.max(insets.bottom, 12),
      backgroundColor: colors.background,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#f7f7f8',
      borderRadius: 24,
      borderWidth: 1,
      borderColor: isFocused ? '#10a37f' : '#e5e5e5',
      paddingHorizontal: 16,
      paddingVertical: 16,
      minHeight: 56,
    },
    textInput: {
      flex: 1,
      fontSize: 16,
      lineHeight: LINE_HEIGHT,
      color: colors.text,
      paddingVertical: 0,
    },
    sendButton: {
      width: 32,
      height: 32,
      marginLeft: 12,
      marginRight: 4,
    },
    sendButtonInner: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: canSend ? '#10a37f' : '#e5e5e5',
      alignItems: 'center',
      justifyContent: 'center',
    },
    disabledOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.1)',
      borderRadius: 24,
    },
    attachButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: '#f0f0f0',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 8,
    },
  });
}
