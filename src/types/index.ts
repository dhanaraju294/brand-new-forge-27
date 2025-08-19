export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  provider: 'local' | 'google' | 'microsoft' | 'yahoo';
  preferences?: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notifications: boolean;
  voiceEnabled: boolean;
  dataMode: boolean;
}

export interface Chat {
  id: string;
  title: string;
  description?: string;
  userId: string;
  workspaceId?: string;
  messageCount: number;
  lastMessageAt?: string;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  chatId: string;
  userId: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  metadata?: MessageMetadata;
  tokens?: number;
  isEdited: boolean;
  editedAt?: string;
  createdAt: string;
}

export interface MessageMetadata {
  dataResult?: DataResult;
  queryInfo?: QueryInfo;
  attachments?: Attachment[];
  reactions?: MessageReaction[];
}

export interface DataResult {
  rowCount: number;
  columns: string[];
  executionTime: number;
  queryType: 'sql' | 'dax';
  cached: boolean;
  preview: any[];
}

export interface QueryInfo {
  query: string;
  queryType: 'sql' | 'dax';
  confidence: number;
  executionTime: number;
}

export interface MessageReaction {
  type: 'like' | 'dislike' | 'bookmark' | 'star';
  userId: string;
  createdAt: string;
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
}

export interface Workspace {
  id: string;
  name: string;
  description: string;
  color: string;
  isShared: boolean;
  ownerId: string;
  chatCount: number;
  lastActivity: string;
  createdAt: string;
  updatedAt: string;
}

export interface Dataset {
  id: string;
  name: string;
  workspace: string;
  tables: string[];
  lastRefresh: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ChatMessage {
  _id: string;
  text: string;
  createdAt: Date;
  user: {
    _id: string;
    name: string;
    avatar?: string;
  };
  system?: boolean;
  sent?: boolean;
  received?: boolean;
  pending?: boolean;
  quickReplies?: QuickReply[];
  data?: any;
}

export interface QuickReply {
  type: 'radio' | 'checkbox';
  values: QuickReplyValue[];
  keepIt?: boolean;
}

export interface QuickReplyValue {
  title: string;
  value: string;
}

export interface VoiceMessage {
  uri: string;
  duration: number;
  waveform?: number[];
}

export interface NetworkState {
  isConnected: boolean;
  isInternetReachable: boolean;
  type: string;
}