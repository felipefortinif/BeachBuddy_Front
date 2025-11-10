import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CentroTreinamento, CentroTreinamentoForm } from '../models/centro-treinamento.model';
import { Treino } from '../models/treino.model';

@Injectable({
  providedIn: 'root'
})
export class CentroTreinamentoService {
  private readonly API_URL = 'http://localhost:8000/api/centros-treinamento';

  constructor(private http: HttpClient) {}

  /**
   * Listar todos os centros de treinamento (público)
   * GET /api/centros-treinamento/
   */
  list(): Observable<CentroTreinamento[]> {
    return this.http.get<CentroTreinamento[]>(`${this.API_URL}/`);
  }

  /**
   * Buscar detalhes de um centro de treinamento (público)
   * GET /api/centros-treinamento/{id}/
   */
  get(id: number): Observable<CentroTreinamento> {
    return this.http.get<CentroTreinamento>(`${this.API_URL}/${id}/`);
  }

  /**
   * Criar novo centro de treinamento (gerente autenticado)
   * POST /api/centros-treinamento/
   */
  create(data: CentroTreinamentoForm): Observable<CentroTreinamento> {
    return this.http.post<CentroTreinamento>(`${this.API_URL}/`, data);
  }

  /**
   * Atualizar centro de treinamento (gerente responsável)
   * PUT /api/centros-treinamento/{id}/
   */
  update(id: number, data: CentroTreinamentoForm): Observable<CentroTreinamento> {
    return this.http.put<CentroTreinamento>(`${this.API_URL}/${id}/`, data);
  }

  /**
   * Atualização parcial (PATCH)
   * PATCH /api/centros-treinamento/{id}/
   */
  partialUpdate(id: number, data: Partial<CentroTreinamentoForm>): Observable<CentroTreinamento> {
    return this.http.patch<CentroTreinamento>(`${this.API_URL}/${id}/`, data);
  }

  /**
   * Deletar centro de treinamento (gerente responsável)
   * DELETE /api/centros-treinamento/{id}/
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}/`);
  }

  /**
   * Listar todos os treinos de um CT
   * GET /api/centros-treinamento/{id}/treinos/
   */
  getTreinos(ctId: number): Observable<Treino[]> {
    return this.http.get<Treino[]>(`${this.API_URL}/${ctId}/treinos/`);
  }

  /**
   * Adicionar professor ao CT
   * POST /api/centros-treinamento/{id}/add_professor/
   */
  addProfessor(ctId: number, professorId: number): Observable<any> {
    return this.http.post(`${this.API_URL}/${ctId}/add_professor/`, { professor_id: professorId });
  }

  /**
   * Remover professor do CT
   * POST /api/centros-treinamento/{id}/remove_professor/
   */
  removeProfessor(ctId: number, professorId: number): Observable<any> {
    return this.http.post(`${this.API_URL}/${ctId}/remove_professor/`, { professor_id: professorId });
  }
}
