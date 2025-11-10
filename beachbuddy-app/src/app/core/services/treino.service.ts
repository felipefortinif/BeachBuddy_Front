import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Treino, TreinoForm } from '../models/treino.model';

@Injectable({
  providedIn: 'root'
})
export class TreinoService {
  private readonly API_URL = 'http://localhost:8000/api/treinos';

  constructor(private http: HttpClient) {}

  list(params?: { data?: string; ct?: number; period?: string }): Observable<Treino[]> {
    let httpParams = new HttpParams();
    
    if (params?.data) {
      httpParams = httpParams.set('data', params.data);
    }
    if (params?.ct) {
      httpParams = httpParams.set('ct', params.ct.toString());
    }
    if (params?.period) {
      httpParams = httpParams.set('period', params.period);
    }
    
    return this.http.get<Treino[]>(this.API_URL + '/', { params: httpParams });
  }

  get(id: number): Observable<Treino> {
    return this.http.get<Treino>(`${this.API_URL}/${id}/`);
  }

  create(data: TreinoForm): Observable<Treino> {
    return this.http.post<Treino>(this.API_URL + '/', data);
  }

  update(id: number, data: TreinoForm): Observable<Treino> {
    return this.http.put<Treino>(`${this.API_URL}/${id}/`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}/`);
  }

  getTreinosPorCt(ctId: number): Observable<Treino[]> {
    return this.http.get<Treino[]>(`${this.API_URL}/por-ct/${ctId}/`);
  }

  getDashboardStats(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/dashboard-stats/`);
  }
}
