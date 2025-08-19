# AIVA Mobile Application - Setup Instructions

Complete step-by-step guide to set up and run the AIVA React Native mobile application.

## 📋 Prerequisites

### **System Requirements**
- **Node.js 18+** - [Download here](https://nodejs.org/)
- **npm** or **yarn** package manager
- **Git** for version control
- **Expo CLI** - Install with `npm install -g @expo/cli`

### **For iOS Development (Mac Only)**
- **Xcode** - Install from Mac App Store
- **iOS Simulator** - Comes with Xcode
- **Apple Developer Account** (for device testing)

### **For Android Development**
- **Android Studio** - [Download here](https://developer.android.com/studio)
- **Android SDK** and **Android Emulator**
- **Java Development Kit (JDK)**

### **Backend Requirements**
- AIVA backend API running (see [server setup](../server/README.md))
- Azure services configured (SQL Database, OpenAI, etc.)

## 🚀 Installation Steps

### **Step 1: Navigate to Mobile App Directory**
```bash
cd mobile-app
```

### **Step 2: Install Dependencies**
```bash
npm install
```

### **Step 3: Environment Configuration**
```bash
# Copy the example environment file
cp .env.example .env
```

Edit the `.env` file with your configuration:
```env
# API Configuration
EXPO_PUBLIC_API_BASE_URL=http://localhost:3000/api

# OAuth Configuration (Optional)
EXPO_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
EXPO_PUBLIC_MICROSOFT_CLIENT_ID=your-microsoft-client-id

# App Configuration
EXPO_PUBLIC_APP_NAME=AIVA
EXPO_PUBLIC_APP_VERSION=1.0.0
```

### **Step 4: Start Development Server**
```bash
npm start
```

This will start the Expo development server and show a QR code.

## 📱 Running on Devices

### **Option 1: Expo Go App (Easiest)**
1. **Install Expo Go** on your phone:
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. **Scan QR Code**:
   - **iOS**: Use Camera app to scan QR code
   - **Android**: Use Expo Go app to scan QR code

### **Option 2: iOS Simulator (Mac Only)**
```bash
npm run ios
```

### **Option 3: Android Emulator**
```bash
npm run android
```

## 🎯 First Time Setup

### **1. Launch the App**
The app will start with a splash screen, followed by onboarding (first launch only).

### **2. Complete Onboarding**
- Welcome screens explaining key features
- Permissions requests (camera, microphone, notifications)
- Skip available for returning users

### **3. Authentication**
- **Create Account**: Email and password registration
- **OAuth Sign In**: Google or Microsoft (if configured)
- **Biometric Setup**: Face ID/Touch ID (optional)

### **4. Explore Features**
- **Chat Tab**: AI-powered conversations
- **Data Tab**: Enterprise data queries
- **Workspaces Tab**: Project organization
- **Profile Tab**: Settings and preferences

## 🔧 Development

### **Available Scripts**
```bash
npm start          # Start Expo development server
npm run android    # Run on Android emulator
npm run ios        # Run on iOS simulator
npm run web        # Run in web browser
npm test           # Run tests
npm run lint       # Run ESLint
```

### **Project Structure**
```
mobile-app/
├── src/
│   ├── screens/           # Screen components
│   │   ├── SplashScreen.tsx
│   │   ├── OnboardingScreen.tsx
│   │   ├── AuthScreen.tsx
│   │   ├── ChatScreen.tsx
│   │   ├── DataScreen.tsx
│   │   ├── WorkspacesScreen.tsx
│   │   └── ProfileScreen.tsx
│   ├── navigation/        # Navigation setup
│   ├── services/          # API services
│   ├── context/           # React contexts
│   └── types/             # TypeScript definitions
├── assets/                # Images, fonts, etc.
├── App.tsx                # Main app component
└── app.json               # Expo configuration
```

### **Key Screens**

#### **ChatScreen.tsx**
- Real-time messaging interface
- AI response streaming
- File attachment support
- Voice input capabilities
- Message actions (like, bookmark)

#### **DataScreen.tsx**
- Natural language data queries
- Database connection management
- Query result visualization
- Sample question suggestions

#### **WorkspacesScreen.tsx**
- Workspace creation and management
- Color-coded organization
- Search and filtering
- Shared workspace support

#### **ProfileScreen.tsx**
- User profile management
- App preferences and settings
- Theme switching
- Notification controls

## 🎨 Customization

### **Theming**
The app supports light and dark themes:
- Automatic system theme detection
- Manual theme switching
- Consistent color palette
- Accessible contrast ratios

### **Styling**
- **React Native Paper** for UI components
- **Custom styling** with StyleSheet
- **Responsive design** for all screen sizes
- **Platform-specific** adaptations

### **Branding**
- Update app icon in `assets/icon.png`
- Modify splash screen in `assets/splash.png`
- Update app name in `app.json`
- Customize colors in theme configuration

## 🔌 Services Integration

### **AuthService**
- User authentication and session management
- OAuth integration with Google and Microsoft
- Secure token storage with Expo SecureStore
- Biometric authentication support

### **ApiService**
- HTTP client with automatic token refresh
- Network error handling and retry logic
- Request queuing for offline scenarios
- Response caching

### **ChatService**
- Chat and message management
- Real-time messaging functionality
- Message search and filtering
- File attachment handling

### **DataService**
- Microsoft Fabric Data Agent integration
- Natural language query processing
- Data visualization and export
- Query performance optimization

### **FileService**
- Document picker integration
- Camera and gallery access
- File upload/download functionality
- Image compression and optimization

### **NotificationService**
- Push notification setup
- Local notification scheduling
- Badge count management
- Deep linking support

## 🧪 Testing

### **Manual Testing Checklist**
- [ ] App launches successfully
- [ ] Onboarding flow works
- [ ] User registration and login
- [ ] OAuth authentication (if configured)
- [ ] Chat functionality with AI responses
- [ ] File upload from camera/gallery
- [ ] Voice input and speech recognition
- [ ] Data query functionality
- [ ] Workspace management
- [ ] Push notifications
- [ ] Offline functionality
- [ ] Theme switching
- [ ] Settings and preferences

### **Device Testing**
Test on multiple devices:
- **iOS**: iPhone (various sizes), iPad
- **Android**: Different manufacturers and screen sizes
- **Physical devices**: Always test on real devices

### **Performance Testing**
- App startup time
- Memory usage
- Battery consumption
- Network request efficiency

## 📦 Building for Production

### **Prerequisites for Building**
1. **Expo Application Services (EAS)**:
   ```bash
   npm install -g @expo/eas-cli
   eas login
   ```

2. **Configure EAS**:
   ```bash
   eas build:configure
   ```

### **Build Commands**
```bash
# Build for both platforms
eas build --platform all

# Build for iOS only
eas build --platform ios

# Build for Android only
eas build --platform android
```

### **App Store Submission**
```bash
# Submit to iOS App Store
eas submit --platform ios

# Submit to Google Play Store
eas submit --platform android
```

## 🔍 Troubleshooting

### **Common Issues**

#### **Expo CLI Issues**
```bash
# Update Expo CLI
npm install -g @expo/cli@latest

# Clear Expo cache
expo r -c
```

#### **Metro Bundle Issues**
```bash
# Clear Metro cache
npx react-native start --reset-cache

# Or with Expo
expo start -c
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

#### **Network Issues**
- Ensure backend API is accessible from mobile device
- Check if device and development machine are on same network
- Verify API base URL in environment variables

#### **OAuth Issues**
- Verify OAuth client IDs are correct
- Check redirect URIs in OAuth provider settings
- Ensure OAuth apps are configured for mobile

### **Debug Tools**
- **Expo Dev Tools**: Built-in debugging
- **React Native Debugger**: Advanced debugging
- **Flipper**: Facebook's debugging platform

## 📊 Performance Optimization

### **Bundle Size**
- Tree shaking removes unused code
- Image optimization and compression
- Lazy loading for screens and components

### **Runtime Performance**
- Memoization for expensive computations
- Virtualized lists for large datasets
- Image caching and lazy loading
- Background task optimization

### **Network Optimization**
- Request deduplication
- Response caching
- Offline-first architecture
- Optimistic updates

## 🔐 Security Considerations

### **Data Storage**
- Sensitive data stored in Expo SecureStore
- No sensitive information in AsyncStorage
- Proper token management and refresh

### **Network Security**
- HTTPS only for API communication
- Certificate pinning (optional)
- Request/response encryption

### **Permissions**
- Request permissions only when needed
- Explain permission usage to users
- Handle permission denials gracefully

## 📱 Platform-Specific Features

### **iOS Features**
- Face ID / Touch ID authentication
- iOS-specific UI components
- Apple Push Notifications
- iOS sharing extensions

### **Android Features**
- Fingerprint authentication
- Android-specific UI components
- Firebase Cloud Messaging
- Android sharing intents

## 🚀 Deployment Options

### **Development Builds**
- **Expo Go**: Quick testing and development
- **Development Builds**: Custom native code support

### **Production Builds**
- **App Store**: iOS App Store distribution
- **Google Play**: Google Play Store distribution
- **Enterprise**: Internal distribution

### **Over-the-Air Updates**
```bash
# Publish update
eas update --branch production
```

## 🤝 Contributing

### **Development Workflow**
1. Create feature branch
2. Make changes with proper testing
3. Test on both iOS and Android
4. Run linting: `npm run lint`
5. Submit pull request

### **Code Style**
- Use TypeScript for type safety
- Follow React Native best practices
- Use React Native Paper components
- Add proper error handling

## 📚 Additional Resources

- **[Expo Documentation](https://docs.expo.dev/)**
- **[React Native Documentation](https://reactnative.dev/)**
- **[React Navigation](https://reactnavigation.org/)**
- **[React Native Paper](https://reactnativepaper.com/)**

---

**🎉 Congratulations!** Your AIVA mobile application is now ready for development and production use.

For web app setup, see **[Web App Instructions](../web-app/INSTRUCTIONS.md)**