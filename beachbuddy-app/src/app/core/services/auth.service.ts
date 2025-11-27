import { Injectable, signal, computed, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, of } from 'rxjs';
import { Usuario, LoginRequest, LoginResponse, SignupRequest } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'https://tranquil-sierra-35516-2375ac2e97d5.herokuapp.com/api'; //http://localhost:8000/
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'current_user';
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  private currentUserSignal = signal<Usuario | null>(null);
  private loadingSignal = signal<boolean>(false);

  // Signals públicos computados
  public readonly currentUser = this.currentUserSignal.asReadonly();
  public readonly isAuthenticated = computed(() => this.currentUserSignal() !== null);
  public readonly isAluno = computed(() => this.currentUserSignal()?.usuario.tipo === 'ALUNO');
  public readonly isProfessor = computed(() => this.currentUserSignal()?.usuario.tipo === 'PROFESSOR');
  public readonly isGerente = computed(() => this.currentUserSignal()?.usuario.tipo === 'GERENTE');
  public readonly loading = this.loadingSignal.asReadonly();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    if (!this.isBrowser) return; // localStorage não existe no servidor
    
    const token = localStorage.getItem(this.TOKEN_KEY);
    const userJson = localStorage.getItem(this.USER_KEY);
    
    if (token && userJson) {
      try {
        const user = JSON.parse(userJson);
        this.currentUserSignal.set(user);
      } catch (e) {
        this.clearAuthData();
      }
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    this.loadingSignal.set(true);
    
    return this.http.post<LoginResponse>(`${this.API_URL}/auth/login/`, credentials).pipe(
      tap(response => {
        this.setAuthData(response.token, response.user);
        this.loadingSignal.set(false);
      }),
      catchError(error => {
        this.loadingSignal.set(false);
        throw error;
      })
    );
  }

  signup(data: SignupRequest): Observable<LoginResponse> {
    this.loadingSignal.set(true);
    
    return this.http.post<LoginResponse>(`${this.API_URL}/auth/signup/`, data).pipe(
      tap(response => {
        this.setAuthData(response.token, response.user);
        this.loadingSignal.set(false);
      }),
      catchError(error => {
        this.loadingSignal.set(false);
        throw error;
      })
    );
  }

  logout(): void {
    this.clearAuthData();
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private setAuthData(token: string, user: Usuario): void {
    if (!this.isBrowser) return;
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.currentUserSignal.set(user);
  }

  private clearAuthData(): void {
    if (!this.isBrowser) return;
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSignal.set(null);
  }

  updateCurrentUser(user: Usuario): void {
    if (!this.isBrowser) return;
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.currentUserSignal.set(user);
  }
}
