import type { Case, CreateCaseDto, UpdateCaseDto } from '@/types/shared';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080/api';

interface ApiResponse<T> {
  ok: boolean;
  data?: T;
  error?: string;
  details?: string;
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string | null
): Promise<ApiResponse<T>> {
  const url = `${API_BASE}${endpoint}`;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json() as ApiResponse<T>;

    if (!response.ok) {
      return {
        ok: false,
        error: data.error || `Erro HTTP ${response.status}`,
        details: data.details,
      };
    }

    return data;
  } catch (error: any) {
    console.error('Erro na requisição:', error);
    return {
      ok: false,
      error: 'Erro de conexão com o servidor',
      details: error.message,
    };
  }
}

export const api = {
  // Waitlist
  async postWaitlist(email: string): Promise<ApiResponse<{ message: string }>> {
    return request('/waitlist', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  // Early Access (landing page)
  async postEarlyAccess(email: string): Promise<ApiResponse<{ message: string }>> {
    return request('/early-access', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  // Case Examples (public, for landing page)
  async getCaseExamples(): Promise<ApiResponse<Case[]>> {
    return request('/cases/examples', {
      method: 'GET',
    });
  },

  // Auth
  async signup(data: {
    email: string;
    senha: string;
    cnpj: string;
    nomeAgencia: string;
    cidade: string;
    nome: string;
  }): Promise<ApiResponse<{ uid: string; email: string; customToken: string; message: string }>> {
    return request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Cases
  async getCases(filters?: {
    status?: string;
    tipo?: string;
    ate?: string;
  }, token?: string | null): Promise<ApiResponse<Case[]>> {
    const queryParams = new URLSearchParams();
    if (filters?.status) queryParams.append('status', filters.status);
    if (filters?.tipo) queryParams.append('tipo', filters.tipo);
    if (filters?.ate) queryParams.append('ate', filters.ate);
    
    const query = queryParams.toString();
    return request(`/cases${query ? `?${query}` : ''}`, {
      method: 'GET',
    }, token);
  },

  async createCase(caso: CreateCaseDto, token?: string | null): Promise<ApiResponse<Case>> {
    return request('/cases', {
      method: 'POST',
      body: JSON.stringify(caso),
    }, token);
  },

  async updateCase(id: string, updates: UpdateCaseDto, token?: string | null): Promise<ApiResponse<Case>> {
    return request(`/cases/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    }, token);
  },

  async generateCasePDF(id: string, token?: string | null): Promise<ApiResponse<{ url: string; filename: string }>> {
    return request(`/cases/${id}/pdf`, {
      method: 'POST',
    }, token);
  },

  // Upload CSV
  async uploadCSV(file: File, token?: string | null): Promise<ApiResponse<{
    pendencias: Array<{
      localizador: string;
      motivo: string;
      dadosCSV?: any;
      dadosSistema?: Case;
    }>;
    totais: {
      linhasProcessadas: number;
      divergenciasEncontradas: number;
      casosNaoEncontrados: number;
      casosComDivergencia: number;
    };
  }>> {
    const formData = new FormData();
    formData.append('file', file);

    // Fetch manual para FormData
    const url = `${API_BASE}/upload-csv`;
    const headers: HeadersInit = {};
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData,
      });

      const data = await response.json() as ApiResponse<any>;

      if (!response.ok) {
        return {
          ok: false,
          error: data.error || `Erro HTTP ${response.status}`,
          details: data.details,
        };
      }

      return data;
    } catch (error: any) {
      console.error('Erro no upload:', error);
      return {
        ok: false,
        error: 'Erro ao fazer upload do arquivo',
        details: error.message,
      };
    }
  },

  // Health
  async health(): Promise<ApiResponse<{ status: string; timestamp: string }>> {
    return request('/health', {
      method: 'GET',
    });
  },
};
