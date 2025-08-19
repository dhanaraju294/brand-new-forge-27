import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { Provider as PaperProvider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import * as Notifications from 'expo-notifications';

// Screens
import SplashScreen from './src/screens/SplashScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import AuthScreen from './src/screens/AuthScreen';
import MainTabNavigator from './src/navigation/MainTabNavigator';

// Services
import { AuthService } from './src/services/AuthService';
import { NotificationService } from './src/services/NotificationService';

// Context
import { AuthProvider } from './src/context/AuthContext';
import { ThemeProvider } from './src/context/ThemeContext';
import { DataProvider } from './src/context/DataContext';

// Types
import { User } from './src/types';

const Stack = createStackNavigator();

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [isFirstLaunch, setIsFirstLaunch] = useState(false);
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    initializeApp();
    setupNetworkListener();
    setupNotifications();
  }, []);

  const initializeApp = async () => {
    try {
      // Check if first launch
      const hasLaunched = await AsyncStorage.getItem('hasLaunched');
      if (!hasLaunched) {
        setIsFirstLaunch(true);
        await AsyncStorage.setItem('hasLaunched', 'true');
      }

      // Check for existing user session
      const savedUser = await AuthService.getCurrentUser();
      if (savedUser) {
        setUser(savedUser);
      }
    } catch (error) {
      console.error('App initialization error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setupNetworkListener = () => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected ?? false);
    });

    return unsubscribe;
  };

  const setupNotifications = async () => {
    await NotificationService.initialize();
  };

  const handleAuthSuccess = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = async () => {
    await AuthService.logout();
    setUser(null);
  };

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <ThemeProvider>
      <PaperProvider>
        <AuthProvider value={{ user, onAuthSuccess: handleAuthSuccess, onLogout: handleLogout }}>
          <DataProvider>
            <NavigationContainer>
              <StatusBar style="auto" />
              <Stack.Navigator screenOptions={{ headerShown: false }}>
                {isFirstLaunch && (
                  <Stack.Screen 
                    name="Onboarding" 
                    component={OnboardingScreen}
                    options={{ gestureEnabled: false }}
                  />
                )}
                {!user ? (
                  <Stack.Screen 
                    name="Auth" 
                    component={AuthScreen}
                    options={{ gestureEnabled: false }}
                  />
                ) : (
                  <Stack.Screen 
                    name="Main" 
                    component={MainTabNavigator}
                    options={{ gestureEnabled: false }}
                  />
                )}
              </Stack.Navigator>
            </NavigationContainer>
          </DataProvider>
        </AuthProvider>
      </PaperProvider>
    </ThemeProvider>
  );
}