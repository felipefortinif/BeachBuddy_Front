import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Usuario } from '../models/user.model';

export interface UpdateProfileData {
  first_name?: string;
  last_name?: string;
  telefone?: string;
  nivel?: string;
  certificacoes?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PerfilService {
  private readonly API_URL = 'http://localhost:8000/api/usuarios';

  constructor(private http: HttpClient) {}

  /**
   * Buscar perfil do usuário autenticado
   * GET /api/usuarios/me/
   */
  get(): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.API_URL}/me/`);
  }

  /**
   * Atualizar perfil do usuário autenticado
   * PATCH /api/usuarios/update_profile/
   * 
   * Campos editáveis: first_name, last_name, telefone, nivel, certificacoes
   * Campos NÃO editáveis: username, email, tipo
   */
  update(data: UpdateProfileData): Observable<Usuario> {
    return this.http.patch<Usuario>(`${this.API_URL}/update_profile/`, data);
  }

  /**
   * Listar todos os usuários (filtro opcional por tipo)
   * GET /api/usuarios/?tipo={tipo}
   */
  list(tipo?: 'ALUNO' | 'PROFESSOR' | 'GERENTE'): Observable<Usuario[]> {
    let params = new HttpParams();
    if (tipo) {
      params = params.set('tipo', tipo);
    }
    return this.http.get<{ results: Usuario[] }>(`${this.API_URL}/`, { params })
      .pipe(
        map(response => response.results)
      );
  }

  /**
   * Buscar usuário por ID
   * GET /api/usuarios/{id}/
   */
  getById(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.API_URL}/${id}/`);
  }

  /**
   * Listar todos os professores
   * GET /api/usuarios/?tipo=PROFESSOR
   */
  getAllProfessores(): Observable<Usuario[]> {
    return this.list('PROFESSOR');
  }

  /**
   * Listar todos os alunos
   * GET /api/usuarios/?tipo=ALUNO
   */
  getAllAlunos(): Observable<Usuario[]> {
    return this.list('ALUNO');
  }

  /**
   * Listar todos os gerentes
   * GET /api/usuarios/?tipo=GERENTE
   */
  getAllGerentes(): Observable<Usuario[]> {
    return this.list('GERENTE');
  }
}
