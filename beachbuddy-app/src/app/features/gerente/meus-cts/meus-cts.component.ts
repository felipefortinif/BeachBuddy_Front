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
  selector: 'app-meus-cts',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './meus-cts.component.html',
  styleUrl: './meus-cts.component.css'
})
export class MeusCtsComponent implements OnInit {
  private ctService = inject(CentroTreinamentoService);
  private treinoService = inject(TreinoService);
  private authService = inject(AuthService);

  cts = signal<CentroTreinamento[]>([]);
  ctsComTreinos = signal<Map<number, number>>(new Map()); // Map<ctId, treinosFuturosCount>

  // Computed signals para as estatísticas
  totalProfessores = computed(() => {
    const professoresSet = new Set();
    this.cts().forEach(ct => {
      if (ct.professores) {
        ct.professores.forEach((p: number) => professoresSet.add(p));
      }
    });
    return professoresSet.size;
  });

  totalTreinos = computed(() => {
    let total = 0;
    this.ctsComTreinos().forEach((count) => {
      total += count;
    });
    return total;
  });

  getTreinosAtivos(ctId: number): number {
    return this.ctsComTreinos().get(ctId) || 0;
  }



  ngOnInit(): void {
    // Buscar apenas os CTs do gerente logado
    this.ctService.getMeusCts().subscribe({
      next: (cts: CentroTreinamento[]) => {
        console.log('CTs do gerente carregados:', cts);
        this.cts.set(cts);

        // Buscar treinos futuros para cada CT
        if (cts.length > 0) {
          this.loadTreinosAtivos(cts);
        }
      },
      error: (err: any) => console.error('Erro ao carregar CTs', err)
    });
  }

  private loadTreinosAtivos(cts: CentroTreinamento[]): void {
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

        console.log('Treinos ativos por CT:', treinosMap);
        this.ctsComTreinos.set(treinosMap);
      },
      error: (err: any) => console.error('Erro ao carregar treinos ativos:', err)
    });
  }
}
