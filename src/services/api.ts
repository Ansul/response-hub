// API service for communicating with the backend server
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface ImpactedPerson {
  id: number;
  name: string;
  email: string;
  reason: string;
  airport: string;
  status: 'pending' | 'resolved' | 'escalated';
  dateReported: string;
}

export interface NewsItem {
  id: number;
  title: string;
  summary: string;
  timestamp: string;
  category: string;
  source: string;
}

export interface Issue {
  id: number;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in-progress' | 'resolved';
  reportedBy: string;
  reportedAt: string;
  assignedTo?: string;
  resolution?: string;
  resolvedAt?: string;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  // Impacted Persons API
  async getImpactedPersons(): Promise<ApiResponse<ImpactedPerson[]>> {
    return this.request<ImpactedPerson[]>('/impacted-persons');
  }

  async createImpactedPerson(person: Omit<ImpactedPerson, 'id'>): Promise<ApiResponse<ImpactedPerson>> {
    return this.request<ImpactedPerson>('/impacted-persons', {
      method: 'POST',
      body: JSON.stringify(person),
    });
  }

  async updateImpactedPerson(id: number, person: Partial<ImpactedPerson>): Promise<ApiResponse<ImpactedPerson>> {
    return this.request<ImpactedPerson>(`/impacted-persons/${id}`, {
      method: 'PUT',
      body: JSON.stringify(person),
    });
  }

  async deleteImpactedPerson(id: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/impacted-persons/${id}`, {
      method: 'DELETE',
    });
  }

  async syncImpactedPersons(persons: ImpactedPerson[]): Promise<ApiResponse<ImpactedPerson[]>> {
    return this.request<ImpactedPerson[]>('/impacted-persons/bulk', {
      method: 'PUT',
      body: JSON.stringify({ persons }),
    });
  }

  async getExcelFileUrl(): Promise<ApiResponse<{ url: string }>> {
    return this.request<{ url: string }>('/impacted-persons/excel');
  }

  // News API
  async getNews(): Promise<ApiResponse<NewsItem[]>> {
    return this.request<NewsItem[]>('/news');
  }

  async syncNews(news: NewsItem[]): Promise<ApiResponse<NewsItem[]>> {
    return this.request<NewsItem[]>('/news', {
      method: 'PUT',
      body: JSON.stringify({ news }),
    });
  }

  // Issues API
  async getIssues(): Promise<ApiResponse<Issue[]>> {
    return this.request<Issue[]>('/issues');
  }

  async syncIssues(issues: Issue[]): Promise<ApiResponse<Issue[]>> {
    return this.request<Issue[]>('/issues', {
      method: 'PUT',
      body: JSON.stringify({ issues }),
    });
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<{ message: string; timestamp: string }>> {
    return this.request<{ message: string; timestamp: string }>('/health');
  }
}

export const apiService = new ApiService();
