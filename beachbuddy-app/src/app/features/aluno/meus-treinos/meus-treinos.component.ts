import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { InscricaoService } from '../../../core/services/inscricao.service';
import { AuthService } from '../../../core/services/auth.service';
import { Inscricao } from '../../../core/models/inscricao.model';

@Component({
  selector: 'app-meus-treinos',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './meus-treinos.component.html',
  styleUrl: './meus-treinos.component.css'
})
export class MeusTreinosComponent implements OnInit {
  private inscricaoService = inject(InscricaoService);
  private authService = inject(AuthService);

  inscricoes = signal<Inscricao[]>([]);
  ativasCount = signal<number>(0);

  ngOnInit(): void {
    this.loadInscricoes();
  }

  private loadInscricoes(): void {
    const user = this.authService.currentUser();
    if (!user) return;

    this.inscricaoService.getMinhasInscricoes(user.id).subscribe({
      next: (data) => {
        this.inscricoes.set(data);
        const ativas = data.filter(i => i.status !== 'CANCELADA').length;
        this.ativasCount.set(ativas);
      },
      error: (err: any) => console.error('Erro ao carregar inscrições', err)
    });
  }

  cancelar(inscricaoId: number): void {
    if (!confirm('Tem certeza que deseja cancelar esta inscrição?')) return;

    this.inscricaoService.cancelar(inscricaoId).subscribe({
      next: () => {
        alert('Inscrição cancelada com sucesso!');
        this.loadInscricoes();
      },
      error: () => alert('Erro ao cancelar inscrição')
    });
  }
}
