export type TipoUsuario = 'ALUNO' | 'PROFESSOR' | 'GERENTE';

export interface Usuario {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  usuario: PerfilUsuario;
}

export interface PerfilUsuario {
  tipo: TipoUsuario;
  nivel?: string;
  telefone?: string;
  certificacoes?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: Usuario;
}

export interface SignupRequest {
  username: string;
  password: string;
  password2: string;
  email: string;
  first_name: string;
  last_name: string;
  tipo: TipoUsuario;
  nivel?: string;
  telefone?: string;
  certificacoes?: string;
}
