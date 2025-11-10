import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CentroTreinamentoService } from '../../../core/services/centro-treinamento.service';
import { AuthService } from '../../../core/services/auth.service';
import { InscricaoService } from '../../../core/services/inscricao.service';

@Component({
  selector: 'app-ct-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './ct-detail.component.html',
  styles: []
})
export class CtDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private ctService = inject(CentroTreinamentoService);
  private authService = inject(AuthService);
  private inscricaoService = inject(InscricaoService);

  ctData = signal<any>(null);
  mostrarTodos = signal<boolean>(false);
  inscritosIds = signal<number[]>([]);

  isAluno = computed(() => this.authService.isAluno());

  ngOnInit(): void {
    const ctId = Number(this.route.snapshot.paramMap.get('id'));
    const showAll = this.route.snapshot.queryParamMap.get('all') === '1';
    this.mostrarTodos.set(showAll);

    this.loadCtDetail(ctId, showAll);
    
    if (this.isAluno()) {
      this.loadInscricoes();
    }
  }

  private loadCtDetail(ctId: number, showAll: boolean): void {
    this.ctService.get(ctId).subscribe({
      next: (data) => this.ctData.set(data),
      error: (err: any) => console.error('Erro ao carregar CT', err)
    });
  }

  private loadInscricoes(): void {
    const user = this.authService.currentUser();
    if (!user) return;

    this.inscricaoService.getMinhasInscricoes(user.id).subscribe({
      next: (inscricoes) => {
        const ids = inscricoes.map(i => i.treino); // treino é o ID
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
