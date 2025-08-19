# AIVA Mobile App

A comprehensive React Native mobile application for the AIVA (Alyasra Intelligent Virtual Assistant) platform, featuring AI-powered conversations with Microsoft Fabric Data Agent integration.

## 🏗️ Architecture

### **Built with:**
- **React Native** with Expo SDK 50
- **TypeScript** for type safety
- **React Navigation** for navigation
- **React Native Paper** for UI components
- **Expo modules** for native functionality

### **Key Features:**

## 📱 **Mobile-First Design**
- **Native Performance**: Optimized for iOS and Android
- **Responsive UI**: Adaptive layouts for all screen sizes
- **Gesture Support**: Native touch interactions and gestures
- **Offline Support**: Cached data and offline functionality
- **Push Notifications**: Real-time notifications

## 🧠 **Microsoft Fabric Integration**
- **Natural Language Queries**: Ask business questions in plain English
- **Data Visualization**: Interactive charts and graphs
- **Real-time Insights**: Live data from your enterprise systems
- **Query Intelligence**: Smart query type detection (SQL vs DAX)
- **Performance Optimization**: Cached results and optimized queries

## 💬 **Advanced Chat System**
- **AI-Powered Conversations**: Azure OpenAI integration
- **Rich Message Types**: Text, images, files, voice messages
- **Quick Replies**: Interactive response options
- **Message Actions**: Like, bookmark, share messages
- **Voice Input**: Speech-to-text functionality
- **File Attachments**: Camera, gallery, and document picker

## 🔐 **Security & Authentication**
- **Multi-Provider OAuth**: Google, Microsoft authentication
- **Secure Storage**: Encrypted token storage
- **Biometric Authentication**: Face ID, Touch ID support
- **Network Security**: Certificate pinning and secure connections

## 📊 **Data Management**
- **Workspace Organization**: Organize chats by projects
- **Search Functionality**: Global and chat-specific search
- **File Management**: Upload, download, and share files
- **Offline Sync**: Automatic data synchronization

## 🚀 **Getting Started**

### **Prerequisites**
- Node.js 18+
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### **Installation**

1. **Navigate to mobile app directory**
   ```bash
   cd mobile-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your configuration:
   ```env
   EXPO_PUBLIC_API_BASE_URL=https://your-api-domain.com/api
   EXPO_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
   EXPO_PUBLIC_MICROSOFT_CLIENT_ID=your-microsoft-client-id
   ```

4. **Start Development**
   ```bash
   # Start Expo development server
   npm start
   
   # Run on iOS simulator
   npm run ios
   
   # Run on Android emulator
   npm run android
   ```

## 📱 **Platform-Specific Setup**

### **iOS Setup**
1. Install Xcode from the App Store
2. Install iOS Simulator
3. Configure signing certificates for device testing

### **Android Setup**
1. Install Android Studio
2. Configure Android SDK and emulator
3. Enable developer mode on physical devices

## 🔧 **Development**

### **Project Structure**
```
mobile-app/
├── src/
│   ├── components/          # Reusable UI components
│   ├── screens/            # Screen components
│   ├── navigation/         # Navigation configuration
│   ├── services/           # API and business logic
│   ├── context/            # React context providers
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Utility functions
├── assets/                 # Images, fonts, and other assets
├── app.json               # Expo configuration
└── package.json           # Dependencies and scripts
```

### **Key Services**

#### **AuthService**
- User authentication and session management
- OAuth integration with Google and Microsoft
- Secure token storage and refresh

#### **ApiService**
- HTTP client with automatic token refresh
- Network error handling and retry logic
- Request/response interceptors

#### **ChatService**
- Chat and message management
- Real-time messaging functionality
- Message search and filtering

#### **DataService**
- Microsoft Fabric Data Agent integration
- Natural language query processing
- Data visualization and export

#### **FileService**
- File upload and download
- Camera and gallery integration
- Document picker functionality

#### **NotificationService**
- Push notification setup
- Local notification scheduling
- Badge count management

## 🎨 **UI/UX Features**

### **Design System**
- **Consistent Theming**: Light and dark mode support
- **Typography**: Scalable font system
- **Color Palette**: Accessible color schemes
- **Spacing**: 8px grid system
- **Icons**: Ionicons icon library

### **Animations**
- **Smooth Transitions**: Page and component transitions
- **Micro-interactions**: Button presses and state changes
- **Loading States**: Skeleton screens and spinners
- **Haptic Feedback**: Touch feedback on interactions

### **Accessibility**
- **Screen Reader Support**: VoiceOver and TalkBack
- **High Contrast**: Accessible color combinations
- **Font Scaling**: Dynamic type support
- **Touch Targets**: Minimum 44pt touch areas

## 🔧 **Configuration**

### **Expo Configuration (app.json)**
```json
{
  "expo": {
    "name": "AIVA",
    "slug": "aiva-mobile",
    "platforms": ["ios", "android"],
    "version": "1.0.0",
    "orientation": "portrait",
    "splash": {
      "backgroundColor": "#1e293b"
    },
    "ios": {
      "bundleIdentifier": "com.alyasra.aiva"
    },
    "android": {
      "package": "com.alyasra.aiva"
    }
  }
}
```

### **Environment Variables**
- `EXPO_PUBLIC_API_BASE_URL`: Backend API URL
- `EXPO_PUBLIC_GOOGLE_CLIENT_ID`: Google OAuth client ID
- `EXPO_PUBLIC_MICROSOFT_CLIENT_ID`: Microsoft OAuth client ID

## 📦 **Building for Production**

### **iOS Build**
```bash
# Build for iOS App Store
eas build --platform ios --profile production

# Submit to App Store
eas submit --platform ios
```

### **Android Build**
```bash
# Build for Google Play Store
eas build --platform android --profile production

# Submit to Play Store
eas submit --platform android
```

## 🧪 **Testing**

### **Unit Testing**
```bash
npm test
```

### **E2E Testing**
```bash
# Install Detox (for E2E testing)
npm install -g detox-cli

# Run E2E tests
detox test
```

## 📊 **Performance Optimization**

### **Bundle Size**
- Tree shaking for unused code elimination
- Image optimization and compression
- Lazy loading for screens and components

### **Runtime Performance**
- Memoization for expensive computations
- Virtualized lists for large datasets
- Image caching and lazy loading

### **Network Optimization**
- Request deduplication
- Response caching
- Offline-first architecture

## 🔍 **Debugging**

### **Development Tools**
- **Flipper**: React Native debugging
- **Reactotron**: State and API monitoring
- **Expo Dev Tools**: Expo-specific debugging

### **Logging**
- Console logging for development
- Crash reporting with Sentry (optional)
- Performance monitoring

## 🚀 **Deployment**

### **Expo Application Services (EAS)**
1. Install EAS CLI: `npm install -g @expo/eas-cli`
2. Configure EAS: `eas build:configure`
3. Build: `eas build --platform all`
4. Submit: `eas submit --platform all`

### **Over-the-Air Updates**
```bash
# Publish update
expo publish

# Update with EAS
eas update --branch production
```

## 🔧 **Troubleshooting**

### **Common Issues**

#### **Metro Bundle Issues**
```bash
# Clear Metro cache
npx react-native start --reset-cache
```

#### **iOS Build Issues**
```bash
# Clean iOS build
cd ios && xcodebuild clean
```

#### **Android Build Issues**
```bash
# Clean Android build
cd android && ./gradlew clean
```

## 📈 **Analytics & Monitoring**

### **Crash Reporting**
- Sentry integration for error tracking
- Custom error boundaries
- Performance monitoring

### **User Analytics**
- Screen tracking
- User interaction events
- Feature usage metrics

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make changes with tests
4. Submit a pull request
5. Follow React Native and Expo best practices

## 📄 **License**

This project is licensed under the MIT License.

---

**AIVA Mobile** - Empowering mobile productivity with AI-driven insights and enterprise data integration.