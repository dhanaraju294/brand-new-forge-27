import { User } from '../types';
import { ApiService } from './ApiService';

const STORAGE_KEYS = {
  USER: 'user',
  TOKEN: 'token',
  REFRESH_TOKEN: 'refresh_token',
};

export class AuthService {
  private static baseUrl = '/api';

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
      // For web, redirect to Google OAuth
      const clientId = '';
      const redirectUri = `${window.location.origin}/auth/callback/google`;
      
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams({
        client_id: clientId!,
        redirect_uri: redirectUri,
        response_type: 'code',
        scope: 'openid profile email',
        access_type: 'offline',
        prompt: 'consent',
      })}`;

      window.location.href = authUrl;
      throw new Error('Redirecting to Google OAuth');
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  }

  static async loginWithMicrosoft(): Promise<User> {
    try {
      // For web, redirect to Microsoft OAuth
      const clientId = '';
      const redirectUri = `${window.location.origin}/auth/callback/microsoft`;
      
      const authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?${new URLSearchParams({
        client_id: clientId!,
        redirect_uri: redirectUri,
        response_type: 'code',
        scope: 'openid profile email',
        response_mode: 'query',
      })}`;

      window.location.href = authUrl;
      throw new Error('Redirecting to Microsoft OAuth');
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
      const userJson = localStorage.getItem(STORAGE_KEYS.USER);
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);

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
      return localStorage.getItem(STORAGE_KEYS.TOKEN);
    } catch (error) {
      console.error('Get token error:', error);
      return null;
    }
  }

  static async refreshToken(): Promise<string | null> {
    try {
      const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
      if (!refreshToken) return null;

      const response = await ApiService.post('/auth/refresh', {
        refreshToken,
      });

      if (response.success && response.data) {
        localStorage.setItem(STORAGE_KEYS.TOKEN, response.data.token);
        if (response.data.refreshToken) {
          localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.data.refreshToken);
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
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      localStorage.setItem(STORAGE_KEYS.TOKEN, token);
      if (refreshToken) {
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
      }
    } catch (error) {
      console.error('Save user session error:', error);
      throw error;
    }
  }

  private static async clearUserSession(): Promise<void> {
    try {
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    } catch (error) {
      console.error('Clear user session error:', error);
    }
  }
}