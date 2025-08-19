import NetInfo from '@react-native-community/netinfo';
import { AuthService } from './AuthService';
import { ApiResponse } from '../types';

export class ApiService {
  private static baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';
  private static requestQueue: Array<() => Promise<any>> = [];
  private static isProcessingQueue = false;

  static async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      // Check network connectivity
      const netInfo = await NetInfo.fetch();
      if (!netInfo.isConnected) {
        throw new Error('No internet connection');
      }

      const url = `${this.baseUrl}${endpoint}`;
      const token = await AuthService.getToken();

      const config: RequestInit = {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options.headers,
        },
      };

      const response = await fetch(url, config);
      
      // Handle token expiration
      if (response.status === 401) {
        const newToken = await AuthService.refreshToken();
        if (newToken) {
          // Retry with new token
          config.headers = {
            ...config.headers,
            Authorization: `Bearer ${newToken}`,
          };
          const retryResponse = await fetch(url, config);
          return await this.handleResponse<T>(retryResponse);
        } else {
          // Refresh failed, redirect to login
          await AuthService.logout();
          throw new Error('Session expired');
        }
      }

      return await this.handleResponse<T>(response);
    } catch (error) {
      console.error('API request error:', error);
      
      // Queue request for retry if network error
      if (error instanceof Error && error.message.includes('network')) {
        return this.queueRequest(() => this.request<T>(endpoint, options));
      }
      
      throw error;
    }
  }

  static async get<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  static async post<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  static async put<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  static async delete<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  static async uploadFile(endpoint: string, file: any, additionalData?: any): Promise<ApiResponse> {
    try {
      const token = await AuthService.getToken();
      const formData = new FormData();
      
      formData.append('file', {
        uri: file.uri,
        type: file.type || 'application/octet-stream',
        name: file.name || 'file',
      } as any);

      if (additionalData) {
        Object.keys(additionalData).forEach(key => {
          formData.append(key, additionalData[key]);
        });
      }

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('File upload error:', error);
      throw error;
    }
  }

  private static async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    try {
      const data = await response.json();
      
      if (response.ok) {
        return {
          success: true,
          data: data.data || data,
          message: data.message,
        };
      } else {
        return {
          success: false,
          error: data.error || data.message || 'Request failed',
        };
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to parse response',
      };
    }
  }

  private static async queueRequest<T>(requestFn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.requestQueue.push(async () => {
        try {
          const result = await requestFn();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });

      this.processQueue();
    });
  }

  private static async processQueue(): Promise<void> {
    if (this.isProcessingQueue || this.requestQueue.length === 0) {
      return;
    }

    this.isProcessingQueue = true;

    while (this.requestQueue.length > 0) {
      const netInfo = await NetInfo.fetch();
      if (!netInfo.isConnected) {
        // Wait for connection
        await new Promise(resolve => setTimeout(resolve, 1000));
        continue;
      }

      const request = this.requestQueue.shift();
      if (request) {
        try {
          await request();
        } catch (error) {
          console.error('Queued request error:', error);
        }
      }
    }

    this.isProcessingQueue = false;
  }
}