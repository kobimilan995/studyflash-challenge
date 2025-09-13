import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ChatHeaderProps {
  onNewChat?: () => void;
  onSettings?: () => void;
}

export function ChatHeader({ onNewChat, onSettings }: ChatHeaderProps) {
  const { colors } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    // Header enter animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleNewChat = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onNewChat?.();
  };

  const handleSettings = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSettings?.();
  };

  const styles = createChatHeaderStyles({ colors });

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
      <View style={styles.leftSection}>
        <TouchableOpacity style={styles.menuButton} onPress={handleNewChat}>
          <Ionicons name="menu-outline" size={20} color={colors.icon} />
        </TouchableOpacity>
        <Text style={styles.title}>ChatGPT 5</Text>
        <Ionicons name="chevron-forward" size={16} color={colors.icon} style={styles.arrowIcon} />
      </View>
      <View style={styles.rightSection}>
        <TouchableOpacity style={styles.button} onPress={handleNewChat}>
          <Ionicons name="create-outline" size={20} color={colors.icon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleSettings}>
          <Ionicons name="ellipsis-vertical" size={20} color={colors.icon} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

// Style function
function createChatHeaderStyles({ colors }: { colors: any }) {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 16,
      backgroundColor: colors.background,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderLight,
    },
    leftSection: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    menuButton: {
      padding: 8,
      marginRight: 12,
    },
    title: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
    },
    arrowIcon: {
      marginLeft: 4,
      marginTop: 2,
    },
    rightSection: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    button: {
      padding: 8,
      marginLeft: 8,
    },
  });
}
