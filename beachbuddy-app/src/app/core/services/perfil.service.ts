import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class PerfilService {
  private readonly API_URL = 'http://localhost:8000/api/perfil';

  constructor(private http: HttpClient) {}

  get(): Observable<Usuario> {
    return this.http.get<Usuario>(this.API_URL + '/');
  }

  update(data: any): Observable<Usuario> {
    return this.http.put<Usuario>(this.API_URL + '/', data);
  }

  getAllProfessores(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.API_URL}/professores/`);
  }
}
