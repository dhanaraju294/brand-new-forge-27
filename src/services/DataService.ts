import { ApiService } from './ApiService';
import { Dataset, ApiResponse } from '../types';

export interface DataQuestionRequest {
  question: string;
  datasetId?: string;
  workspaceId?: string;
  queryType?: 'dax' | 'sql';
  includeVisualization?: boolean;
}

export interface DataQuestionResponse {
  answer: string;
  data?: {
    rowCount: number;
    columns: string[];
    executionTime: number;
    queryType: string;
    cached: boolean;
    preview: any[];
  };
  query?: string;
  queryType?: string;
  visualization?: any;
  confidence: number;
  executionTime: number;
  tokens: number;
}

export interface DirectQueryRequest {
  query: string;
  queryType: 'dax' | 'sql';
  datasetId?: string;
  workspaceId?: string;
}

export class DataService {
  static async askDataQuestion(request: DataQuestionRequest): Promise<ApiResponse<DataQuestionResponse>> {
    try {
      return await ApiService.post<DataQuestionResponse>('/data/question', request);
    } catch (error) {
      console.error('Ask data question error:', error);
      throw error;
    }
  }

  static async executeDirectQuery(request: DirectQueryRequest): Promise<ApiResponse<any>> {
    try {
      return await ApiService.post('/data/query', request);
    } catch (error) {
      console.error('Execute direct query error:', error);
      throw error;
    }
  }

  static async getDatasets(workspaceId?: string): Promise<ApiResponse<Dataset[]>> {
    try {
      const endpoint = workspaceId ? `/data/datasets?workspaceId=${workspaceId}` : '/data/datasets';
      return await ApiService.get<Dataset[]>(endpoint);
    } catch (error) {
      console.error('Get datasets error:', error);
      throw error;
    }
  }

  static async getDatasetSchema(datasetId: string, workspaceId?: string): Promise<ApiResponse<any>> {
    try {
      const endpoint = workspaceId 
        ? `/data/datasets/${datasetId}/schema?workspaceId=${workspaceId}`
        : `/data/datasets/${datasetId}/schema`;
      return await ApiService.get(endpoint);
    } catch (error) {
      console.error('Get dataset schema error:', error);
      throw error;
    }
  }

  static async analyzeQuestion(question: string): Promise<ApiResponse<{
    suggestedQueryType: 'dax' | 'sql';
    suggestedDataset?: string;
    confidence: number;
    reasoning: string;
  }>> {
    try {
      return await ApiService.post('/data/analyze', { question });
    } catch (error) {
      console.error('Analyze question error:', error);
      throw error;
    }
  }

  static async getQuerySuggestions(datasetId: string, workspaceId?: string): Promise<ApiResponse<string[]>> {
    try {
      const endpoint = workspaceId
        ? `/data/datasets/${datasetId}/suggestions?workspaceId=${workspaceId}`
        : `/data/datasets/${datasetId}/suggestions`;
      return await ApiService.get<string[]>(endpoint);
    } catch (error) {
      console.error('Get query suggestions error:', error);
      throw error;
    }
  }
}