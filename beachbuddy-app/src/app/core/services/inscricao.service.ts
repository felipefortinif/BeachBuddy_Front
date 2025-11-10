import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Inscricao } from '../models/inscricao.model';

@Injectable({
  providedIn: 'root'
})
export class InscricaoService {
  private readonly API_URL = 'http://localhost:8000/api/inscricoes';

  constructor(private http: HttpClient) {}

  list(): Observable<Inscricao[]> {
    return this.http.get<Inscricao[]>(this.API_URL + '/');
  }

  create(treinoId: number): Observable<Inscricao> {
    return this.http.post<Inscricao>(this.API_URL + '/', { treino_id: treinoId });
  }

  cancelar(inscricaoId: number): Observable<Inscricao> {
    return this.http.post<Inscricao>(`${this.API_URL}/${inscricaoId}/cancelar/`, {});
  }

  getMinhasInscricoes(): Observable<Inscricao[]> {
    return this.http.get<Inscricao[]>(`${this.API_URL}/minhas/`);
  }
}
