import { useTheme } from '@/hooks/useTheme';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

export function TypingIndicator() {
  const { colors, isDark } = useTheme();
  const dot1 = useRef(new Animated.Value(0.3)).current;
  const dot2 = useRef(new Animated.Value(0.3)).current;
  const dot3 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animateDots = () => {
      const createAnimation = (dot: Animated.Value, delay: number) => {
        return Animated.loop(
          Animated.sequence([
            Animated.timing(dot, {
              toValue: 1,
              duration: 600,
              delay,
              useNativeDriver: true,
            }),
            Animated.timing(dot, {
              toValue: 0.3,
              duration: 600,
              useNativeDriver: true,
            }),
          ])
        );
      };

      Animated.parallel([
        createAnimation(dot1, 0),
        createAnimation(dot2, 200),
        createAnimation(dot3, 400),
      ]).start();
    };

    animateDots();
  }, []);

  const styles = createTypingIndicatorStyles({ colors, isDark });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.dot, { opacity: dot1 }]} />
      <Animated.View style={[styles.dot, { opacity: dot2 }]} />
      <Animated.View style={[styles.dot, { opacity: dot3 }]} />
    </View>
  );
}

// Style function
function createTypingIndicatorStyles({ colors, isDark }: { colors: any; isDark: boolean }) {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 16,
      marginHorizontal: 16,
      marginVertical: 8,
      backgroundColor: colors.assistantMessage,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: colors.borderLight,
      shadowColor: isDark ? '#000' : '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: isDark ? 0.3 : 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    dot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: colors.accent,
      marginHorizontal: 2,
    },
  });
}
