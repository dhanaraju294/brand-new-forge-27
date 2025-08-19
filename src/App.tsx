import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Screens
import SplashScreen from './screens/SplashScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import AuthScreen from './screens/AuthScreen';
import MainLayout from './components/MainLayout';

// Services
import { AuthService } from './services/AuthService';

// Context
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { DataProvider } from './context/DataContext';

// Types
import { User } from './types';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [isFirstLaunch, setIsFirstLaunch] = useState(false);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Check if first launch
      const hasLaunched = localStorage.getItem('hasLaunched');
      if (!hasLaunched) {
        setIsFirstLaunch(true);
        localStorage.setItem('hasLaunched', 'true');
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
      <AuthProvider value={{ user, onAuthSuccess: handleAuthSuccess, onLogout: handleLogout }}>
        <DataProvider>
          <Router>
            <div className="App">
              <Routes>
                {isFirstLaunch && (
                  <Route path="/onboarding" element={<OnboardingScreen />} />
                )}
                {!user ? (
                  <>
                    <Route path="/auth" element={<AuthScreen />} />
                    <Route path="*" element={<Navigate to="/auth" replace />} />
                  </>
                ) : (
                  <>
                    <Route path="/*" element={<MainLayout />} />
                    <Route path="/auth" element={<Navigate to="/" replace />} />
                  </>
                )}
                {isFirstLaunch && (
                  <Route path="/" element={<Navigate to="/onboarding" replace />} />
                )}
              </Routes>
            </div>
          </Router>
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}