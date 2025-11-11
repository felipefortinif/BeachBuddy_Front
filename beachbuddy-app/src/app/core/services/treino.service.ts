import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Treino, TreinoForm } from '../models/treino.model';
import { Inscricao } from '../models/inscricao.model';

@Injectable({
  providedIn: 'root'
})
export class TreinoService {
  private readonly API_URL = 'http://localhost:8000/api/treinos';

  constructor(private http: HttpClient) {}

  /**
   * Listar treinos com filtros opcionais
   * GET /api/treinos/?ct={id}&data_min={date}&data_max={date}
   */
  list(params?: { ct?: number; data_min?: string; data_max?: string }): Observable<Treino[]> {
    let httpParams = new HttpParams();
    
    if (params?.ct) {
      httpParams = httpParams.set('ct', params.ct.toString());
    }
    if (params?.data_min) {
      httpParams = httpParams.set('data_min', params.data_min);
    }
    if (params?.data_max) {
      httpParams = httpParams.set('data_max', params.data_max);
    }
    
    return this.http.get<{ results: Treino[] }>(`${this.API_URL}/`, { params: httpParams })
      .pipe(
        map(response => response.results)
      );
  }

  /**
   * Buscar detalhes de um treino
   * GET /api/treinos/{id}/
   */
  get(id: number): Observable<Treino> {
    return this.http.get<Treino>(`${this.API_URL}/${id}/`);
  }

  /**
   * Criar novo treino (professor autenticado)
   * POST /api/treinos/
   */
  create(data: TreinoForm): Observable<Treino> {
    return this.http.post<Treino>(`${this.API_URL}/`, data);
  }

  /**
   * Atualizar treino (professor responsável)
   * PUT /api/treinos/{id}/
   */
  update(id: number, data: TreinoForm): Observable<Treino> {
    return this.http.put<Treino>(`${this.API_URL}/${id}/`, data);
  }

  /**
   * Atualização parcial (PATCH)
   * PATCH /api/treinos/{id}/
   */
  partialUpdate(id: number, data: Partial<TreinoForm>): Observable<Treino> {
    return this.http.patch<Treino>(`${this.API_URL}/${id}/`, data);
  }

  /**
   * Deletar treino (professor responsável)
   * DELETE /api/treinos/{id}/
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}/`);
  }

  /**
   * Listar inscrições de um treino
   * GET /api/treinos/{id}/inscricoes/
   */
  getInscricoes(treinoId: number): Observable<Inscricao[]> {
    return this.http.get<Inscricao[]>(`${this.API_URL}/${treinoId}/inscricoes/`);
  }

  /**
   * Buscar treinos por centro de treinamento
   * Usa o filtro ?ct={id}
   */
  getTreinosPorCt(ctId: number): Observable<Treino[]> {
    return this.list({ ct: ctId });
  }

  /**
   * Buscar treinos de hoje em diante
   */
  getTreinosFuturos(): Observable<Treino[]> {
    const hoje = new Date().toISOString().split('T')[0];
    return this.list({ data_min: hoje });
  }
}
