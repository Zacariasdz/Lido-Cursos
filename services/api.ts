
/**
 * API Service Utility
 * Centraliza as chamadas de rede e gerencia autenticação
 */

const BASE_URL = process.env.VITE_API_URL || 'https://api.lido.education/v1';

interface RequestOptions extends RequestInit {
  params?: Record<string, string>;
}

// Fixed: Moved request function outside the object literal to ensure proper generic type inference.
// This resolves the "Untyped function calls may not accept type arguments" error when calling from methods via 'this'.
async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const token = localStorage.getItem('lido_auth_token');
  
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const url = new URL(`${BASE_URL}${endpoint}`);
  if (options.params) {
    Object.keys(options.params).forEach(key => 
      url.searchParams.append(key, options.params![key])
    );
  }

  try {
    const response = await fetch(url.toString(), { ...options, headers });
    
    if (response.status === 401) {
      localStorage.removeItem('lido_auth_token');
      window.location.href = '#/login';
      throw new Error('Sessão expirada');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Erro na requisição');
    }

    return await response.json() as T;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

export const api = {
  request,

  // Fixed: Calling standalone request<T> instead of this.request<T> (Line 52)
  get<T>(endpoint: string, params?: Record<string, string>) {
    return request<T>(endpoint, { method: 'GET', params });
  },

  // Fixed: Calling standalone request<T> instead of this.request<T> (Line 56)
  post<T>(endpoint: string, body: any) {
    return request<T>(endpoint, { 
      method: 'POST', 
      body: JSON.stringify(body) 
    });
  },

  // Fixed: Calling standalone request<T> instead of this.request<T> (Line 63)
  put<T>(endpoint: string, body: any) {
    return request<T>(endpoint, { 
      method: 'PUT', 
      body: JSON.stringify(body) 
    });
  },

  // Fixed: Calling standalone request<T> instead of this.request<T> (Line 70)
  delete<T>(endpoint: string) {
    return request<T>(endpoint, { method: 'DELETE' });
  }
};
