import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Inscricao } from '../models/inscricao.model';

@Injectable({
  providedIn: 'root'
})
export class InscricaoService {
  private readonly API_URL = 'http://localhost:8000/api/inscricoes';

  constructor(private http: HttpClient) {}

  /**
   * Listar inscrições com filtros opcionais
   * GET /api/inscricoes/?treino={id}&aluno={id}&status={status}
   */
  list(params?: { treino?: number; aluno?: number; status?: string }): Observable<Inscricao[]> {
    let httpParams = new HttpParams();
    
    if (params?.treino) {
      httpParams = httpParams.set('treino', params.treino.toString());
    }
    if (params?.aluno) {
      httpParams = httpParams.set('aluno', params.aluno.toString());
    }
    if (params?.status) {
      httpParams = httpParams.set('status', params.status);
    }
    
    return this.http.get<Inscricao[]>(`${this.API_URL}/`, { params: httpParams });
  }

  /**
   * Buscar detalhes de uma inscrição
   * GET /api/inscricoes/{id}/
   */
  get(id: number): Observable<Inscricao> {
    return this.http.get<Inscricao>(`${this.API_URL}/${id}/`);
  }

  /**
   * Criar nova inscrição (aluno autenticado)
   * POST /api/inscricoes/
   */
  create(treinoId: number): Observable<Inscricao> {
    return this.http.post<Inscricao>(`${this.API_URL}/`, { treino: treinoId });
  }

  /**
   * Atualizar status da inscrição
   * PUT /api/inscricoes/{id}/
   */
  update(id: number, data: Partial<Inscricao>): Observable<Inscricao> {
    return this.http.put<Inscricao>(`${this.API_URL}/${id}/`, data);
  }

  /**
   * Deletar/Cancelar inscrição
   * DELETE /api/inscricoes/{id}/
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}/`);
  }

  /**
   * Confirmar inscrição
   * POST /api/inscricoes/{id}/confirmar/
   */
  confirmar(inscricaoId: number): Observable<Inscricao> {
    return this.http.post<Inscricao>(`${this.API_URL}/${inscricaoId}/confirmar/`, {});
  }

  /**
   * Cancelar inscrição
   * POST /api/inscricoes/{id}/cancelar/
   */
  cancelar(inscricaoId: number): Observable<Inscricao> {
    return this.http.post<Inscricao>(`${this.API_URL}/${inscricaoId}/cancelar/`, {});
  }

  /**
   * Buscar minhas inscrições (aluno logado)
   * Usa filtro ?aluno={user_id}
   */
  getMinhasInscricoes(alunoId: number): Observable<Inscricao[]> {
    return this.list({ aluno: alunoId });
  }

  /**
   * Buscar inscrições por status
   */
  getByStatus(status: 'PENDENTE' | 'CONFIRMADA' | 'CANCELADA'): Observable<Inscricao[]> {
    return this.list({ status });
  }
}
