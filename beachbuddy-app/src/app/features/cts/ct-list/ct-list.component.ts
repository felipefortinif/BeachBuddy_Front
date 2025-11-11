import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CentroTreinamentoService } from '../../../core/services/centro-treinamento.service';
import { AuthService } from '../../../core/services/auth.service';
import { CentroTreinamento } from '../../../core/models/centro-treinamento.model';

@Component({
  selector: 'app-ct-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './ct-list.component.html',
  styles: []
})
export class CtListComponent implements OnInit {
  private ctService = inject(CentroTreinamentoService);
  private authService = inject(AuthService);

  cts = signal<CentroTreinamento[]>([]);

  isProfessor = computed(() => this.authService.isProfessor());
  isGerente = computed(() => this.authService.isGerente());
  currentUserId = computed(() => this.authService.currentUser()?.id || 0);

  ngOnInit(): void {
    this.loadCts();
  }

  private loadCts(): void {
    this.ctService.list().subscribe({
      next: (response: any) => {
        const ctsArray = response.results || [];
        this.cts.set(ctsArray);
      },
      error: (err) => console.error('Erro ao carregar CTs:', err)
    });
  }
}
