import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CentroTreinamentoService } from '../../../core/services/centro-treinamento.service';
import { TreinoService } from '../../../core/services/treino.service';
import { AuthService } from '../../../core/services/auth.service';
import { CentroTreinamento } from '../../../core/models/centro-treinamento.model';
import { Treino } from '../../../core/models/treino.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-ct-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './ct-list.component.html',
  styleUrl: './ct-list.component.css'
})
export class CtListComponent implements OnInit {
  private ctService = inject(CentroTreinamentoService);
  private treinoService = inject(TreinoService);
  private authService = inject(AuthService);

  cts = signal<CentroTreinamento[]>([]);
  ctsComTreinos = signal<Map<number, number>>(new Map()); // Map<ctId, treinosFuturosCount>

  isProfessor = computed(() => this.authService.isProfessor());
  isGerente = computed(() => this.authService.isGerente());
  currentUserId = computed(() => this.authService.currentUser()?.id || 0);

  getTreinosFuturos(ctId: number): number {
    return this.ctsComTreinos().get(ctId) || 0;
  }

  ngOnInit(): void {
    this.loadCts();
  }

  private loadCts(): void {
    this.ctService.list().subscribe({
      next: (cts: CentroTreinamento[]) => {
        this.cts.set(cts);
        
        // Buscar treinos futuros para cada CT
        if (cts.length > 0) {
          this.loadTreinosFuturos(cts);
        }
      },
      error: (err) => console.error('Erro ao carregar CTs:', err)
    });
  }

  private loadTreinosFuturos(cts: CentroTreinamento[]): void {
    const hoje = new Date().toISOString().split('T')[0]; // formato YYYY-MM-DD
    
    // Criar array de observables para buscar treinos de cada CT
    const treinoRequests = cts.map(ct => 
      this.treinoService.list({ ct: ct.id, data_min: hoje })
    );

    // Executar todas as requisições em paralelo
    forkJoin(treinoRequests).subscribe({
      next: (results: Treino[][]) => {
        const treinosMap = new Map<number, number>();
        
        cts.forEach((ct, index) => {
          const treinosFuturos = results[index];
          treinosMap.set(ct.id, treinosFuturos.length);
        });
        
        console.log('Treinos futuros por CT:', treinosMap);
        this.ctsComTreinos.set(treinosMap);
      },
      error: (err: any) => console.error('Erro ao carregar treinos futuros:', err)
    });
  }
}
