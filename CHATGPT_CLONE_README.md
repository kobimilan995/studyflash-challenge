# ChatGPT Clone - Studyflash Mobile Challenge

A high-fidelity ChatGPT clone built with Expo and the Vercel AI SDK, focusing on UX parity with the original ChatGPT interface.

## Features Implemented

### 🎨 **Visual Design**
- **ChatGPT-inspired color scheme** with proper light/dark mode support
- **Authentic message bubbles** with proper spacing and shadows
- **Consistent typography** and visual hierarchy
- **Smooth animations** and microinteractions

### 💬 **Chat Experience**
- **Streaming text display** with token-by-token rendering
- **Auto-scroll behavior** that preserves user scroll position
- **Message grouping** with proper avatar logic
- **Markdown rendering** for rich text formatting
- **Message actions** (like, dislike, copy to clipboard)

### ⌨️ **Input & Interaction**
- **Multiline composer** that grows up to 6 lines before scrolling
- **Attach button** with disabled state during streaming
- **Keyboard avoidance** with proper safe area handling
- **Message suggestions** for empty chat state
- **Haptic feedback** for all interactions

### 🎭 **Animations & Polish**
- **Message mount animations** (slide + fade)
- **Typing indicator** with animated dots
- **Smooth transitions** for UI elements
- **Haptic feedback** throughout the app
- **Proper loading states** and error handling

### 🛠️ **Tool Integration**
- **Weather widget** with ChatGPT-style UI
- **Tool calling support** via Vercel AI SDK
- **Proper error handling** and fallbacks

## Technical Implementation

### Architecture
- **Modular component structure** for maintainability
- **Custom theme system** with light/dark mode support
- **TypeScript** for type safety
- **React Native Reanimated** for smooth animations

### Key Components
- `ChatScreen` - Main chat interface with auto-scroll
- `Message` - Individual message with actions and streaming
- `Composer` - Multiline input with keyboard handling
- `TypingIndicator` - Animated typing indicator
- `MessageSuggestions` - Empty state suggestions
- `ChatHeader` - Top navigation bar
- `WeatherWidget` - Tool calling widget

### UX Highlights
- **Streaming detection** for proper loading states
- **Auto-scroll preservation** when user scrolls up
- **Smooth animations** for all interactions
- **Haptic feedback** for tactile responses
- **Proper keyboard handling** on iOS and Android
- **Safe area support** for all devices

## Getting Started

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Set up environment variables:
   ```bash
   echo "GOOGLE_GENERATIVE_AI_API_KEY=your_key_here" > .env.local
   ```

3. Start the development server:
   ```bash
   npx expo start
   ```

4. Run on device:
   - **iOS Simulator:** Press `i` in terminal
   - **Real device:** Install Expo Go and scan QR code

## Key Files

- `app/(tabs)/index.tsx` - Main app component
- `components/ChatScreen.tsx` - Chat interface
- `components/Message.tsx` - Message component
- `components/Composer.tsx` - Input component
- `constants/Colors.ts` - Theme colors
- `hooks/useTheme.ts` - Theme hook

## UX Focus Areas

This implementation prioritizes the following UX aspects:

1. **Visual Fidelity** - Pixel-perfect recreation of ChatGPT's design
2. **Smooth Animations** - Subtle, purposeful motion throughout
3. **Responsive Input** - Multiline composer with proper keyboard handling
4. **Streaming Experience** - Real-time text display with proper loading states
5. **Haptic Feedback** - Tactile responses for all interactions
6. **Accessibility** - Proper contrast, touch targets, and screen reader support

The app successfully recreates the core ChatGPT experience with attention to detail in animations, interactions, and overall polish.
