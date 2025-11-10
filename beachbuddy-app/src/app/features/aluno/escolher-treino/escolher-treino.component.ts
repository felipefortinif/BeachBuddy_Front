import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TreinoService } from '../../../core/services/treino.service';
import { InscricaoService } from '../../../core/services/inscricao.service';
import { CentroTreinamentoService } from '../../../core/services/centro-treinamento.service';
import { Treino } from '../../../core/models/treino.model';
import { CentroTreinamento } from '../../../core/models/centro-treinamento.model';

@Component({
  selector: 'app-escolher-treino',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './escolher-treino.component.html',
  styleUrl: './escolher-treino.component.css'
})
export class EscolherTreinoComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private treinoService = inject(TreinoService);
  private inscricaoService = inject(InscricaoService);
  private ctService = inject(CentroTreinamentoService);

  ct = signal<CentroTreinamento | null>(null);
  treinos = signal<Treino[]>([]);
  inscritosIds = signal<number[]>([]);

  ngOnInit(): void {
    const ctId = Number(this.route.snapshot.paramMap.get('ctId'));
    
    this.ctService.get(ctId).subscribe({
      next: (data) => this.ct.set(data.ct),
      error: () => {}
    });

    this.treinoService.getTreinosPorCt(ctId).subscribe({
      next: (data) => this.treinos.set(data),
      error: () => {}
    });

    this.inscricaoService.getMinhasInscricoes().subscribe({
      next: (inscricoes) => {
        const ids = inscricoes.map(i => i.treino.id);
        this.inscritosIds.set(ids);
      },
      error: () => {}
    });
  }

  inscrever(treinoId: number): void {
    this.inscricaoService.create(treinoId).subscribe({
      next: () => {
        alert('Inscrição realizada com sucesso!');
        this.inscritosIds.update(ids => [...ids, treinoId]);
      },
      error: () => alert('Erro ao realizar inscrição')
    });
  }
}
