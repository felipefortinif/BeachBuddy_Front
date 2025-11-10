import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Metrics {
  metric_cts: number;
  metric_professores: number;
  metric_treinos: number;
  metric_alunos: number;
}

@Injectable({
  providedIn: 'root'
})
export class MetricsService {
  private readonly API_URL = 'http://localhost:8000/api/metrics';

  constructor(private http: HttpClient) {}

  /**
   * Buscar métricas públicas da plataforma
   * GET /api/metrics/
   * 
   * Retorna estatísticas gerais:
   * - Total de centros de treinamento
   * - Total de professores
   * - Total de treinos futuros
   * - Total de alunos
   */
  get(): Observable<Metrics> {
    return this.http.get<Metrics>(`${this.API_URL}/`);
  }
}
