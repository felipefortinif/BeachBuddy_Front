/**
 * Configuração centralizada das URLs da API
 */

export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/api'
};

/**
 * Endpoints da API
 */
export const API_ENDPOINTS = {
  // Autenticação
  AUTH: {
    LOGIN: '/auth/login/',
    SIGNUP: '/auth/signup/',
    TOKEN: '/auth/token/',
    TOKEN_REFRESH: '/auth/token/refresh/',
    TOKEN_VERIFY: '/auth/token/verify/',
  },
  
  // Centros de Treinamento
  CENTROS_TREINAMENTO: '/centros-treinamento/',
  
  // Treinos
  TREINOS: '/treinos/',
  
  // Inscrições
  INSCRICOES: '/inscricoes/',
  
  // Usuários
  USUARIOS: '/usuarios/',
  
  // Métricas
  METRICS: '/metrics/',
} as const;

/**
 * Helper para construir URLs completas
 */
export function getApiUrl(endpoint: string): string {
  return `${environment.apiUrl}${endpoint}`;
}
