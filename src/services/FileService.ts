import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { ApiService } from './ApiService';
import { ApiResponse, Attachment } from '../types';

export class FileService {
  static async pickDocument(): Promise<DocumentPicker.DocumentPickerResult> {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
        multiple: false,
      });

      return result;
    } catch (error) {
      console.error('Document picker error:', error);
      throw error;
    }
  }

  static async pickImage(options: {
    allowsEditing?: boolean;
    aspect?: [number, number];
    quality?: number;
  } = {}): Promise<ImagePicker.ImagePickerResult> {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Permission to access media library denied');
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: options.allowsEditing ?? true,
        aspect: options.aspect ?? [4, 3],
        quality: options.quality ?? 0.8,
      });

      return result;
    } catch (error) {
      console.error('Image picker error:', error);
      throw error;
    }
  }

  static async takePhoto(options: {
    allowsEditing?: boolean;
    aspect?: [number, number];
    quality?: number;
  } = {}): Promise<ImagePicker.ImagePickerResult> {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Permission to access camera denied');
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: options.allowsEditing ?? true,
        aspect: options.aspect ?? [4, 3],
        quality: options.quality ?? 0.8,
      });

      return result;
    } catch (error) {
      console.error('Camera error:', error);
      throw error;
    }
  }

  static async uploadFile(
    file: {
      uri: string;
      name: string;
      type: string;
    },
    additionalData?: {
      chatId?: string;
      messageId?: string;
    }
  ): Promise<ApiResponse<Attachment>> {
    try {
      return await ApiService.uploadFile('/files/upload', file, additionalData);
    } catch (error) {
      console.error('File upload error:', error);
      throw error;
    }
  }

  static async getUserFiles(): Promise<ApiResponse<Attachment[]>> {
    try {
      return await ApiService.get<Attachment[]>('/files');
    } catch (error) {
      console.error('Get user files error:', error);
      throw error;
    }
  }

  static async deleteFile(fileName: string): Promise<ApiResponse> {
    try {
      return await ApiService.delete(`/files/${fileName}`);
    } catch (error) {
      console.error('Delete file error:', error);
      throw error;
    }
  }

  static async downloadFile(fileName: string, url: string): Promise<string> {
    try {
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;
      const downloadResult = await FileSystem.downloadAsync(url, fileUri);
      
      if (downloadResult.status === 200) {
        return downloadResult.uri;
      } else {
        throw new Error('Download failed');
      }
    } catch (error) {
      console.error('Download file error:', error);
      throw error;
    }
  }

  static async getFileInfo(uri: string): Promise<FileSystem.FileInfo> {
    try {
      return await FileSystem.getInfoAsync(uri);
    } catch (error) {
      console.error('Get file info error:', error);
      throw error;
    }
  }

  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  static getFileIcon(mimeType: string): string {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'music';
    if (mimeType.includes('pdf')) return 'file-pdf';
    if (mimeType.includes('word')) return 'file-word';
    if (mimeType.includes('excel')) return 'file-excel';
    if (mimeType.includes('powerpoint')) return 'file-powerpoint';
    if (mimeType.includes('text')) return 'file-text';
    return 'file';
  }
}