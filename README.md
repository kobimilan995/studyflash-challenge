# Studyflash Mobile Challenge - ChatGPT Clone

A high-fidelity ChatGPT clone built with Expo, React Native, and the Vercel AI SDK. This implementation focuses on pixel-perfect recreation of ChatGPT's user experience with smooth animations, proper streaming, and comprehensive UX polish.

## 🚀 Features Implemented

### 🎨 **Visual Design & Theming**
- **ChatGPT-inspired color scheme** with comprehensive light/dark mode support
- **Authentic message bubbles** with proper spacing, shadows, and visual hierarchy
- **Consistent typography** matching ChatGPT's design system
- **Dynamic theming** with `useTheme` hook and centralized color management
- **Safe area handling** for all device types and orientations

### 💬 **Chat Experience**
- **Real-time streaming** with token-by-token text rendering
- **Intelligent auto-scroll** that preserves user scroll position when they scroll up
- **Message grouping** with proper avatar logic and visual continuity
- **Markdown rendering** for rich text formatting and code blocks
- **Message actions** (like, dislike, copy to clipboard) with haptic feedback
- **Error handling** with animated error states and user-friendly messages

### ⌨️ **Input & Interaction**
- **Multiline composer** that grows up to 6 lines before internal scrolling
- **Smart send button** that appears/disappears based on input state
- **Attach button** with disabled state during streaming
- **Keyboard avoidance** with proper safe area handling for iOS and Android
- **Message suggestions** for empty chat state to guide user interaction
- **Haptic feedback** for all touch interactions (impact, selection, notification)

### 🎭 **Animations & Polish**
- **Message mount animations** (slide + fade) for smooth message appearance
- **Typing indicator** with animated dots and proper timing
- **Smooth transitions** for all UI state changes
- **Scale animations** for button interactions
- **Error state animations** with scale and translate effects
- **Loading state management** with proper visual feedback

### 🛠️ **Tool Integration**
- **Weather widget** with ChatGPT-style UI and realistic data generation
- **Tool calling support** via Vercel AI SDK with proper error handling
- **Streaming tool responses** with proper UI integration

## 🏗️ **Technical Architecture**

### **Core Structure**
```
app/
├── index.tsx              # Main app component with chat state management
├── api/chat+api.ts        # API route with Gemini integration and tool calling
└── _layout.tsx            # Root layout with theme provider

screens/ChatScreen/
├── ChatScreen.tsx         # Main chat interface component
├── styles.ts              # Styled components with theme integration
└── hooks/                 # Custom hooks for chat behavior
    ├── useAutoScroll.ts   # Intelligent scroll management
    ├── useChatAnimations.ts # Animation state management
    ├── useScrollState.ts  # User scroll tracking
    └── useSuggestionsVisibility.ts # Suggestion display logic

components/
├── Message.tsx            # Individual message with actions and streaming
├── Composer.tsx           # Multiline input with keyboard handling
├── ChatHeader.tsx         # Top navigation bar
├── TypingIndicator.tsx    # Animated typing indicator
├── MessageSuggestions.tsx # Empty state suggestions
└── ThemedText.tsx         # Themed text component
```

### **State Management**
- **Chat State**: Managed by `@ai-sdk/react` with `useChat` hook
- **UI State**: Local component state with React hooks
- **Theme State**: Global theme context with `useTheme` hook
- **Animation State**: React Native Reanimated for smooth 60fps animations

### **Key Implementation Details**

#### **1. Streaming & Auto-Scroll Logic**
```typescript
// Auto-scroll behavior that respects user interaction
useAutoScroll({
  messages,           // Current message array
  isLoading,         // Streaming state
  userScrolled,      // Whether user manually scrolled
  scrollViewRef,     // ScrollView reference
});
```

The auto-scroll system:
- **Preserves user scroll position** when they scroll up to read previous messages
- **Automatically scrolls to bottom** for new messages when user is at bottom
- **Handles streaming updates** by detecting content changes in real-time
- **Uses debounced scrolling** to prevent excessive scroll operations

#### **2. Message Rendering & Actions**
```typescript
// Message component with streaming support and actions
<Message
  message={message}
  isStreaming={false}
  onLike={handleLike}
  onDislike={handleDislike}
  onCopy={handleCopy}
/>
```

Features:
- **Mount animations** with slide and fade effects
- **Action buttons** (like, dislike, copy) with haptic feedback
- **Markdown rendering** for code blocks, lists, and formatting
- **Proper text selection** and clipboard integration
- **Responsive design** that adapts to different screen sizes

#### **3. Composer with Multiline Support**
```typescript
// Smart composer that grows with content
<Composer
  onSend={handleSend}
  disabled={isLoading}
  onAttach={handleAttach}
/>
```

Implementation:
- **Dynamic height** that grows up to 6 lines before scrolling
- **Smart send button** that appears when text is entered
- **Keyboard handling** with proper safe area adjustments
- **Haptic feedback** for all interactions
- **Disabled state** during streaming to prevent multiple sends

#### **4. Theme System**
```typescript
// Centralized theming with light/dark mode
const { colors } = useTheme();
const styles = createChatScreenStyles({ colors });
```

Features:
- **Dynamic color switching** between light and dark modes
- **Consistent color palette** across all components
- **Proper contrast ratios** for accessibility
- **System theme detection** with manual override capability

#### **5. API Integration**
```typescript
// Streaming API with tool calling
const result = streamText({
  model: google('gemini-2.5-flash'),
  messages: convertToModelMessages(messages),
  tools: {
    weather: tool({
      description: 'Get weather information',
      inputSchema: z.object({
        location: z.string(),
      }),
      execute: async ({ location }) => {
        // Generate realistic weather data
      },
    }),
  },
});
```

Features:
- **Gemini 2.5 Flash** model for fast responses
- **Tool calling** with weather widget integration
- **Streaming responses** with proper UI updates
- **Error handling** with user-friendly messages
- **Realistic mock data** for demonstration purposes

## 🚀 **Getting Started**

### **Prerequisites**
- Node.js 18+ and pnpm installed
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS development) or Android Studio (for Android)

### **Installation**

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Set up environment variables:**
   ```bash
   echo "GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key_here" > .env.local
   ```

3. **Start the development server:**
   ```bash
   npx expo start
   ```

4. **Run on device:**
   - **iOS Simulator:** Press `i` in terminal
   - **Android Emulator:** Press `a` in terminal
   - **Real device:** Install Expo Go and scan QR code

### **Development Build (Optional)**
For production builds or native module access:

```bash
# iOS
pnpm expo run:ios

# Android
pnpm expo run:android
```

## 🎯 **Key UX Decisions**

### **1. Auto-Scroll Intelligence**
- **Preserves user context** by not auto-scrolling when user scrolls up
- **Smooth streaming experience** by auto-scrolling during AI responses
- **Debounced updates** to prevent scroll jank during rapid content changes

### **2. Animation Philosophy**
- **Subtle and purposeful** animations that enhance rather than distract
- **60fps performance** using React Native Reanimated
- **Haptic feedback** for all interactions to provide tactile confirmation
- **Consistent timing** across all animations (300ms standard)

### **3. Input Experience**
- **Multiline support** that feels natural and responsive
- **Smart keyboard handling** that works across iOS and Android
- **Visual feedback** for all states (focused, disabled, error)
- **Accessibility support** with proper touch targets and contrast

### **4. Error Handling**
- **Graceful degradation** when API calls fail
- **User-friendly error messages** instead of technical jargon
- **Retry mechanisms** where appropriate
- **Visual error states** with proper animations

## 📱 **Platform Support**

- **iOS**: Full support with native animations and haptics
- **Android**: Complete feature parity with Material Design adaptations
- **Web**: Basic support (limited by React Native Web capabilities)

## 🔧 **Customization**

The app is designed to be easily customizable:

- **Colors**: Modify `constants/Colors.ts` for theme changes
- **Animations**: Adjust timing in individual component files
- **Layout**: Update styles in `screens/ChatScreen/styles.ts`
- **API**: Modify `app/api/chat+api.ts` for different models or tools

## 📊 **Performance Optimizations**

- **Memoized components** to prevent unnecessary re-renders
- **Efficient scroll handling** with proper event throttling
- **Optimized animations** using native drivers
- **Lazy loading** for heavy components
- **Proper memory management** for long chat sessions

This implementation successfully recreates the core ChatGPT experience with attention to detail in animations, interactions, and overall polish, making it a production-ready mobile chat application.
