import AsyncStorage from '@react-native-async-storage/async-storage';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import * as SecureStore from 'expo-secure-store';
import { User } from '../types';
import { ApiService } from './ApiService';

WebBrowser.maybeCompleteAuthSession();

const STORAGE_KEYS = {
  USER: 'user',
  TOKEN: 'token',
  REFRESH_TOKEN: 'refresh_token',
};

export class AuthService {
  private static baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';

  // OAuth Configuration
  private static oauthConfig = {
    google: {
      clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
      redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
      scopes: ['openid', 'profile', 'email'],
    },
    microsoft: {
      clientId: process.env.EXPO_PUBLIC_MICROSOFT_CLIENT_ID,
      redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
      scopes: ['openid', 'profile', 'email'],
    },
  };

  static async login(email: string, password: string): Promise<User> {
    try {
      const response = await ApiService.post('/auth/login', {
        email,
        password,
      });

      if (response.success && response.data) {
        await this.saveUserSession(response.data.user, response.data.token);
        return response.data.user;
      }

      throw new Error(response.error || 'Login failed');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  static async register(userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }): Promise<User> {
    try {
      const response = await ApiService.post('/auth/register', userData);

      if (response.success && response.data) {
        await this.saveUserSession(response.data.user, response.data.token);
        return response.data.user;
      }

      throw new Error(response.error || 'Registration failed');
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  static async loginWithGoogle(): Promise<User> {
    try {
      const config = this.oauthConfig.google;
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams({
        client_id: config.clientId!,
        redirect_uri: config.redirectUri,
        response_type: 'code',
        scope: config.scopes.join(' '),
        access_type: 'offline',
        prompt: 'consent',
      })}`;

      const result = await AuthSession.startAsync({
        authUrl,
        returnUrl: config.redirectUri,
      });

      if (result.type === 'success' && result.params.code) {
        const response = await ApiService.post('/auth/google/callback', {
          code: result.params.code,
        });

        if (response.success && response.data) {
          await this.saveUserSession(response.data.user, response.data.token);
          return response.data.user;
        }
      }

      throw new Error('Google authentication failed');
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  }

  static async loginWithMicrosoft(): Promise<User> {
    try {
      const config = this.oauthConfig.microsoft;
      const authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?${new URLSearchParams({
        client_id: config.clientId!,
        redirect_uri: config.redirectUri,
        response_type: 'code',
        scope: config.scopes.join(' '),
        response_mode: 'query',
      })}`;

      const result = await AuthSession.startAsync({
        authUrl,
        returnUrl: config.redirectUri,
      });

      if (result.type === 'success' && result.params.code) {
        const response = await ApiService.post('/auth/microsoft/callback', {
          code: result.params.code,
        });

        if (response.success && response.data) {
          await this.saveUserSession(response.data.user, response.data.token);
          return response.data.user;
        }
      }

      throw new Error('Microsoft authentication failed');
    } catch (error) {
      console.error('Microsoft login error:', error);
      throw error;
    }
  }

  static async logout(): Promise<void> {
    try {
      // Call logout endpoint
      await ApiService.post('/auth/logout');
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Clear local storage regardless of API call result
      await this.clearUserSession();
    }
  }

  static async getCurrentUser(): Promise<User | null> {
    try {
      const userJson = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      const token = await SecureStore.getItemAsync(STORAGE_KEYS.TOKEN);

      if (userJson && token) {
        // Verify token is still valid
        const response = await ApiService.get('/auth/verify');
        if (response.success) {
          return JSON.parse(userJson);
        }
      }

      // Token invalid, clear session
      await this.clearUserSession();
      return null;
    } catch (error) {
      console.error('Get current user error:', error);
      await this.clearUserSession();
      return null;
    }
  }

  static async getToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(STORAGE_KEYS.TOKEN);
    } catch (error) {
      console.error('Get token error:', error);
      return null;
    }
  }

  static async refreshToken(): Promise<string | null> {
    try {
      const refreshToken = await SecureStore.getItemAsync(STORAGE_KEYS.REFRESH_TOKEN);
      if (!refreshToken) return null;

      const response = await ApiService.post('/auth/refresh', {
        refreshToken,
      });

      if (response.success && response.data) {
        await SecureStore.setItemAsync(STORAGE_KEYS.TOKEN, response.data.token);
        if (response.data.refreshToken) {
          await SecureStore.setItemAsync(STORAGE_KEYS.REFRESH_TOKEN, response.data.refreshToken);
        }
        return response.data.token;
      }

      return null;
    } catch (error) {
      console.error('Refresh token error:', error);
      return null;
    }
  }

  private static async saveUserSession(user: User, token: string, refreshToken?: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      await SecureStore.setItemAsync(STORAGE_KEYS.TOKEN, token);
      if (refreshToken) {
        await SecureStore.setItemAsync(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
      }
    } catch (error) {
      console.error('Save user session error:', error);
      throw error;
    }
  }

  private static async clearUserSession(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.USER);
      await SecureStore.deleteItemAsync(STORAGE_KEYS.TOKEN);
      await SecureStore.deleteItemAsync(STORAGE_KEYS.REFRESH_TOKEN);
    } catch (error) {
      console.error('Clear user session error:', error);
    }
  }
}