import type { Case, CreateCaseDto, UpdateCaseDto } from '@/types/shared';

// Em desenvolvimento: usa VITE_API_BASE do .env (http://localhost:8080/api)
// Em produção: se VITE_API_BASE não estiver definida, usa a URL do Cloud Run
const API_BASE = import.meta.env.VITE_API_BASE || 'https://konzup-hub-backend-rsdkbytqeq-uc.a.run.app/api';

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

    // Verifica se a resposta é JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return {
        ok: false,
        error: 'Erro de conexão com o servidor',
        details: 'O servidor não está respondendo corretamente. Verifique se o backend está rodando em http://localhost:8080',
      };
    }

    const data = await response.json() as ApiResponse<T>;

    if (!response.ok) {
      return {
        ok: false,
        error: data.error || `Erro HTTP ${response.status}`,
        details: data.details,
      };
    }

    return data;
  } catch (error: unknown) {
    console.error('Erro na requisição:', error);
    let errorMessage = 'Erro de conexão com o servidor';
    let errorDetails = '';
    
    if (error instanceof Error) {
      errorDetails = error.message;
      if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
        errorMessage = 'Não foi possível conectar ao servidor. Verifique se o backend está rodando.';
      }
    }
    
    return {
      ok: false,
      error: errorMessage,
      details: errorDetails,
    };
  }
}

export const api = {
  // Waitlist
  // Rota: POST /api/waitlist
  // Backend: backend/src/routes/waitlist.ts -> router.post('/', ...)
  // Endpoint completo: https://konzup-hub-backend-rsdkbytqeq-uc.a.run.app/api/waitlist
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

  // Auth - Signup (criação de conta)
  // Rota: POST /api/auth/signup
  // Backend: backend/src/routes/auth.ts -> router.post('/signup', ...)
  // Endpoint completo: https://konzup-hub-backend-rsdkbytqeq-uc.a.run.app/api/auth/signup
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
      dadosCSV?: Record<string, unknown>;
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

      const data = await response.json() as ApiResponse<{
        pendencias: Array<{
          localizador: string;
          motivo: string;
          dadosCSV?: Record<string, unknown>;
          dadosSistema?: Case;
        }>;
        totais: {
          linhasProcessadas: number;
          divergenciasEncontradas: number;
          casosNaoEncontrados: number;
          casosComDivergencia: number;
        };
      }>;

      if (!response.ok) {
        return {
          ok: false,
          error: data.error || `Erro HTTP ${response.status}`,
          details: data.details,
        };
      }

      return data;
    } catch (error: unknown) {
      console.error('Erro no upload:', error);
      return {
        ok: false,
        error: 'Erro ao fazer upload do arquivo',
        details: error instanceof Error ? error.message : 'Erro desconhecido',
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
