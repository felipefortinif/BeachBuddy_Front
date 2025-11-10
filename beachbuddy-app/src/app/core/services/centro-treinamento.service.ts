import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CentroTreinamento, CentroTreinamentoForm } from '../models/centro-treinamento.model';

@Injectable({
  providedIn: 'root'
})
export class CentroTreinamentoService {
  private readonly API_URL = 'http://localhost:8000/api/cts';

  constructor(private http: HttpClient) {}

  list(): Observable<CentroTreinamento[]> {
    return this.http.get<CentroTreinamento[]>(this.API_URL + '/');
  }

  get(id: number, params?: { all?: boolean }): Observable<any> {
    let httpParams = new HttpParams();
    if (params?.all) {
      httpParams = httpParams.set('all', '1');
    }
    return this.http.get<any>(`${this.API_URL}/${id}/`, { params: httpParams });
  }

  create(data: CentroTreinamentoForm): Observable<CentroTreinamento> {
    return this.http.post<CentroTreinamento>(this.API_URL + '/', data);
  }

  update(id: number, data: CentroTreinamentoForm): Observable<CentroTreinamento> {
    return this.http.put<CentroTreinamento>(`${this.API_URL}/${id}/`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}/`);
  }

  getMeusCts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/meus-cts/`);
  }

  getProfessores(ctId: number): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/${ctId}/professores/`);
  }

  updateProfessores(ctId: number, professorIds: number[]): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/${ctId}/professores/`, { professores: professorIds });
  }
}
