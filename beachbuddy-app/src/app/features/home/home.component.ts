import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

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
  
  metrics = signal<HomeMetrics>({
    metric_cts: 0,
    metric_professores: 0,
    metric_treinos: 0,
    metric_alunos: 0
  });

  ngOnInit(): void {
    this.http.get<HomeMetrics>('http://localhost:8000/api/metrics/').subscribe({
      next: (data) => this.metrics.set(data),
      error: () => {} // Silently fail
    });
  }
}
