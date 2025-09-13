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
    ├── useFlashlistItems.ts # FlashList data management and optimization
    ├── useScrollState.ts  # User scroll tracking
    ├── useScrollToBottomButton.ts # Scroll button visibility logic
    └── useSuggestionsVisibility.ts # Suggestion display logic

components/
├── Message.tsx            # Individual message with actions and streaming
├── MessageListItem.tsx    # FlashList item renderer for different message types
├── Composer.tsx           # Multiline input with keyboard handling
├── ChatHeader.tsx         # Top navigation bar
├── TypingIndicator.tsx    # Animated typing indicator
├── MessageSuggestions.tsx # Empty state suggestions
├── ScrollToBottomButton.tsx # Animated scroll-to-bottom button
├── WeatherWidget.tsx      # Weather tool widget with ChatGPT-style UI
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
  scrollViewRef,     // FlashList reference
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

#### **5. Weather Widget Component**
```typescript
// Standalone weather widget with ChatGPT-style UI
<WeatherWidget data={weatherData} />
```

Features:
- **ChatGPT-inspired design** with proper spacing and typography
- **Temperature conversion** from Fahrenheit to Celsius
- **Realistic weather data** with location, conditions, and forecasts
- **Interactive elements** with expandable details
- **Consistent theming** that adapts to light/dark modes
- **Proper error handling** with fallback values

#### **6. API Integration**
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

### **FlashList Integration for Large Message Lists**

This implementation uses **@shopify/flash-list** instead of the standard ScrollView to handle large conversation histories with optimal performance. FlashList is a high-performance list component that provides significant performance improvements over traditional scrolling solutions.

#### **What is FlashList?**
FlashList is a performant alternative to React Native's FlatList and ScrollView that uses advanced virtualization techniques to render only visible items. It provides:

- **Virtualization**: Only renders items currently visible on screen, dramatically reducing memory usage
- **Component Recycling**: Reuses components as users scroll, eliminating the overhead of creating/destroying components
- **Superior Performance**: Up to 5x better FPS on UI thread and 10x better FPS on JavaScript thread compared to FlatList
- **Memory Efficiency**: Prevents memory bloat with large datasets by dynamically loading/unloading items

#### **Implementation Details**

```typescript
// FlashList integration in ChatScreen
<FlashList
  ref={flashListRef}
  data={listData}
  renderItem={({ item }) => (
    <MessageListItem
      item={item}
      onSuggestionPress={handleSuggestionPress}
    />
  )}
  keyExtractor={item => item.id}
  onScroll={handleScroll}
  scrollEventThrottle={16}
  showsVerticalScrollIndicator={false}
  contentContainerStyle={styles.contentContainer}
/>
```

#### **Data Structure Optimization**

The chat messages are transformed into a structured format optimized for FlashList:

```typescript
interface MessageListItemType {
  id: string;
  type: 'message' | 'suggestions' | 'typing' | 'error';
  data?: UIMessage | string | Error;
}
```

This approach allows FlashList to efficiently handle different item types (messages, suggestions, typing indicators, errors) while maintaining smooth scrolling performance.

#### **Message List Item Rendering**

The `MessageListItem` component handles different message types with specialized rendering:

```typescript
// MessageListItem component with type-specific rendering
<MessageListItem
  item={item}
  onSuggestionPress={handleSuggestionPress}
/>
```

Features:
- **Type-based rendering** for messages, suggestions, typing indicators, and errors
- **Error state handling** with styled error containers and user-friendly messages
- **Suggestion integration** with proper touch handling and callbacks
- **Consistent theming** across all message types

#### **Performance Benefits**

- **Scalability**: Can handle thousands of messages without performance degradation
- **Memory Management**: Automatic cleanup of off-screen components prevents memory leaks
- **Smooth Scrolling**: Maintains 60fps even with complex message layouts and animations
- **Battery Efficiency**: Reduced CPU usage leads to better battery life on mobile devices

#### **Scroll-to-Bottom Button**

The app includes an intelligent scroll-to-bottom button that appears when users scroll up:

```typescript
// Scroll-to-bottom button with smart visibility
<ScrollToBottomButton
  visible={showButton}
  onPress={handleScrollToBottom}
/>
```

Features:
- **Smart visibility** that only shows when user scrolls up from bottom
- **Smooth animations** with scale and translate effects
- **Haptic feedback** on press for tactile confirmation
- **Auto-hide** when user reaches bottom or new messages arrive
- **Throttled scroll detection** for optimal performance

#### **Additional Performance Optimizations**

- **Memoized components** to prevent unnecessary re-renders
- **Efficient scroll handling** with proper event throttling
- **Optimized animations** using native drivers
- **Lazy loading** for heavy components
- **Proper memory management** for long chat sessions

This implementation successfully recreates the core ChatGPT experience with attention to detail in animations, interactions, and overall polish, making it a production-ready mobile chat application.
