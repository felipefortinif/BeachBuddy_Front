import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/services/auth.service';

interface HomeMetrics {
  metric_cts: number;
  metric_professores: number;
  metric_treinos: number;
  metric_alunos: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private router = inject(Router);
  
  metrics = signal<HomeMetrics>({
    metric_cts: 0,
    metric_professores: 0,
    metric_treinos: 0,
    metric_alunos: 0
  });

  ngOnInit(): void {
    // Se o usuário já está logado, redirecionar para a tela apropriada
    if (this.authService.isAuthenticated()) {
      this.redirectAuthenticatedUser();
      return;
    }

    // Buscar métricas apenas se não estiver logado
    this.http.get<HomeMetrics>('http://localhost:8000/api/metrics/').subscribe({
      next: (data) => this.metrics.set(data),
      error: () => {} // Silently fail
    });
  }

  private redirectAuthenticatedUser(): void {
    if (this.authService.isAluno()) {
      this.router.navigate(['/aluno/novo-treino']);
    } else if (this.authService.isProfessor()) {
      this.router.navigate(['/professor/dashboard']);
    } else if (this.authService.isGerente()) {
      this.router.navigate(['/gerente/meus-cts']);
    } else {
      // Fallback: redireciona para CTs se o tipo não for reconhecido
      this.router.navigate(['/cts']);
    }
  }
}
