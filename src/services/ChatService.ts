import { ApiService } from './ApiService';
import { Chat, Message, PaginatedResponse, ApiResponse } from '../types';

export class ChatService {
  static async getChats(page = 1, limit = 20): Promise<PaginatedResponse<Chat>> {
    try {
      const response = await ApiService.get<Chat[]>(`/chat?page=${page}&limit=${limit}`);
      return response as PaginatedResponse<Chat>;
    } catch (error) {
      console.error('Get chats error:', error);
      throw error;
    }
  }

  static async createChat(title: string, description?: string, workspaceId?: string): Promise<ApiResponse<Chat>> {
    try {
      return await ApiService.post<Chat>('/chat', {
        title,
        description,
        workspaceId,
      });
    } catch (error) {
      console.error('Create chat error:', error);
      throw error;
    }
  }

  static async sendMessage(
    message: string,
    chatId?: string,
    options?: {
      datasetId?: string;
      workspaceId?: string;
      useDataAgent?: boolean;
    }
  ): Promise<ApiResponse<{
    chatId: string;
    userMessage: Message;
    aiResponse: Message;
    dataResult?: any;
    queryInfo?: any;
  }>> {
    try {
      return await ApiService.post('/chat/message', {
        message,
        chatId,
        ...options,
      });
    } catch (error) {
      console.error('Send message error:', error);
      throw error;
    }
  }

  static async getChatMessages(
    chatId: string,
    page = 1,
    limit = 50
  ): Promise<PaginatedResponse<Message>> {
    try {
      const response = await ApiService.get<Message[]>(
        `/chat/${chatId}/messages?page=${page}&limit=${limit}`
      );
      return response as PaginatedResponse<Message>;
    } catch (error) {
      console.error('Get chat messages error:', error);
      throw error;
    }
  }

  static async deleteChat(chatId: string): Promise<ApiResponse> {
    try {
      return await ApiService.delete(`/chat/${chatId}`);
    } catch (error) {
      console.error('Delete chat error:', error);
      throw error;
    }
  }

  static async reactToMessage(
    chatId: string,
    messageId: string,
    actionType: 'like' | 'dislike' | 'bookmark' | 'star'
  ): Promise<ApiResponse> {
    try {
      return await ApiService.post(`/chat/${chatId}/messages/${messageId}/actions`, {
        actionType,
      });
    } catch (error) {
      console.error('React to message error:', error);
      throw error;
    }
  }

  static async searchChats(query: string, page = 1, limit = 10): Promise<PaginatedResponse<any>> {
    try {
      const response = await ApiService.get<any[]>(
        `/search?q=${encodeURIComponent(query)}&type=chats&page=${page}&limit=${limit}`
      );
      return response as PaginatedResponse<any>;
    } catch (error) {
      console.error('Search chats error:', error);
      throw error;
    }
  }

  static async searchInChat(
    chatId: string,
    query: string,
    page = 1,
    limit = 20
  ): Promise<PaginatedResponse<Message>> {
    try {
      const response = await ApiService.get<Message[]>(
        `/search/chats/${chatId}?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`
      );
      return response as PaginatedResponse<Message>;
    } catch (error) {
      console.error('Search in chat error:', error);
      throw error;
    }
  }
}