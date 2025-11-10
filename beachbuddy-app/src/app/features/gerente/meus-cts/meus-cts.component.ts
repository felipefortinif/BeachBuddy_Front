import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CentroTreinamentoService } from '../../../core/services/centro-treinamento.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-meus-cts',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './meus-cts.component.html',
  styleUrl: './meus-cts.component.css'
})
export class MeusCtsComponent implements OnInit {
  private ctService = inject(CentroTreinamentoService);
  private authService = inject(AuthService);

  cts = signal<any[]>([]);

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
    return this.cts().reduce((total, ct) => total + (ct.treinos?.length || 0), 0);
  });

  ngOnInit(): void {
    // Buscar todos os CTs (a API filtrará pelos CTs do gerente logado automaticamente)
    this.ctService.list().subscribe({
      next: (data: any) => {
        this.cts.set(data);
      },
      error: (err: any) => console.error('Erro ao carregar CTs', err)
    });
  }
}
