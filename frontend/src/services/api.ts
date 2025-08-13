
import axios from 'axios';
import type { Usuario, Captura, DirectorioExterno, LoginResponse, ApiError } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include User-ID header
api.interceptors.request.use((config) => {
  const userId = localStorage.getItem('userId');
  if (userId) {
    config.headers['User-ID'] = userId;
  }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('userId');
      localStorage.removeItem('userRole');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Auth Services
export const authService = {
  async login(usuario: string, contrasena: string): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/usuarios/login', {
      usuario,
      contrasena,
    });
    return response.data;
  },

  async createUser(userData: { usuario: string; contrasena: string; rol: string }): Promise<{ mensaje: string; id: number }> {
    const response = await api.post('/usuarios/usuarios', userData);
    return response.data;
  },
};

// Captura Services
export const capturaService = {
  async getCapturas(): Promise<Captura[]> {
    const response = await api.get<Captura[]>('/captura/');
    return response.data;
  },

  async createCaptura(capturaData: Partial<Captura>): Promise<{ mensaje: string; folio_acaac: number }> {
    const response = await api.post('/captura/', capturaData);
    return response.data;
  },

  async updateCaptura(folio: number, capturaData: Partial<Captura>): Promise<{ mensaje: string }> {
    const response = await api.put(`/captura/${folio}`, capturaData);
    return response.data;
  },

  async deleteCaptura(folio: number): Promise<{ mensaje: string }> {
    const response = await api.delete(`/captura/${folio}`);
    return response.data;
  },

  async testAlertas(): Promise<{ mensaje: string }> {
    const response = await api.get('/captura/test-alertas');
    return response.data;
  },
};

// DirectorioExterno Services
export const directorioExternoService = {
  async getDirectorios(): Promise<DirectorioExterno[]> {
    const response = await api.get<DirectorioExterno[]>('/directorio-externo/');
    return response.data;
  },

  async createDirectorio(directorioData: Partial<DirectorioExterno>): Promise<{ mensaje: string; id: number }> {
    const response = await api.post('/directorio-externo/', directorioData);
    return response.data;
  },

  async updateDirectorio(id: number, directorioData: Partial<DirectorioExterno>): Promise<{ mensaje: string }> {
    const response = await api.put(`/directorio-externo/${id}`, directorioData);
    return response.data;
  },

  async deleteDirectorio(id: number): Promise<{ mensaje: string }> {
    const response = await api.delete(`/directorio-externo/${id}`);
    return response.data;
  },
};

export default api;
