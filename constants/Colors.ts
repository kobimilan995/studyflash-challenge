/**
 * ChatGPT-inspired color scheme with light and dark mode support
 */

const tintColorLight = '#10a37f';
const tintColorDark = '#10a37f';

export const Colors = {
  light: {
    // Background colors
    background: '#ffffff',
    surface: '#f7f7f8',
    surfaceSecondary: '#ffffff',

    // Text colors
    text: '#353740',
    textSecondary: '#6e6e80',
    textMuted: '#8e8ea0',

    // Border colors
    border: '#e5e5e5',
    borderLight: '#f0f0f0',

    // Accent colors
    accent: '#10a37f',
    accentHover: '#0d8f6f',

    // Message colors
    userMessage: '#f7f7f8',
    assistantMessage: '#ffffff',

    // Status colors
    success: '#10a37f',
    error: '#ef4444',
    warning: '#f59e0b',

    // UI elements
    tint: tintColorLight,
    icon: '#6e6e80',
    tabIconDefault: '#6e6e80',
    tabIconSelected: tintColorLight,

    // Input colors
    inputBackground: '#ffffff',
    inputBorder: '#e5e5e5',
    inputFocus: '#10a37f',

    // Button colors
    buttonPrimary: '#10a37f',
    buttonSecondary: '#f0f0f0',
    buttonText: '#ffffff',
    buttonTextSecondary: '#353740',
  },
  dark: {
    // Background colors
    background: '#212121',
    surface: '#2f2f2f',
    surfaceSecondary: '#40414f',

    // Text colors
    text: '#ececf1',
    textSecondary: '#c5c5d2',
    textMuted: '#8e8ea0',

    // Border colors
    border: '#565869',
    borderLight: '#40414f',

    // Accent colors
    accent: '#10a37f',
    accentHover: '#0d8f6f',

    // Message colors
    userMessage: '#2f2f2f',
    assistantMessage: '#40414f',

    // Status colors
    success: '#10a37f',
    error: '#ef4444',
    warning: '#f59e0b',

    // UI elements
    tint: tintColorDark,
    icon: '#c5c5d2',
    tabIconDefault: '#8e8ea0',
    tabIconSelected: tintColorDark,

    // Input colors
    inputBackground: '#40414f',
    inputBorder: '#565869',
    inputFocus: '#10a37f',

    // Button colors
    buttonPrimary: '#10a37f',
    buttonSecondary: '#565869',
    buttonText: '#ececf1',
    buttonTextSecondary: '#ececf1',
  },
};
