import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CentroTreinamentoService } from '../../../core/services/centro-treinamento.service';
import { AuthService } from '../../../core/services/auth.service';
import { InscricaoService } from '../../../core/services/inscricao.service';
import { TreinoService } from '../../../core/services/treino.service';
import { Treino } from '../../../core/models/treino.model';

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
  private treinoService = inject(TreinoService);
  private authService = inject(AuthService);
  private inscricaoService = inject(InscricaoService);

  ctData = signal<any>(null);
  treinosData = signal<{
    todos: Treino[];
    futuros: Treino[];
    passados: Treino[];
    proximoTreino: Treino | null;
    exibir: Treino[];
  }>({
    todos: [],
    futuros: [],
    passados: [],
    proximoTreino: null,
    exibir: []
  });
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
    // Carrega informações básicas do CT
    this.ctService.get(ctId).subscribe({
      next: (data) => {
        this.ctData.set(data);
        console.log('CT carregado:', data);
      },
      error: (err: any) => console.error('Erro ao carregar CT', err)
    });

    // Carrega todos os treinos do CT
    this.treinoService.list({ ct: ctId }).subscribe({
      next: (treinos) => {
        console.log('=== DEBUG TREINOS ===');
        console.log('Total de treinos recebidos da API:', treinos.length);
        console.log('Treinos completos:', treinos);
        
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        console.log('Data de hoje (00:00:00):', hoje);
        
        // Separa treinos futuros e passados com debug detalhado
        const futuros = treinos
          .filter(t => {
            const dataTreino = new Date(t.data);
            dataTreino.setHours(0, 0, 0, 0);
            const isFuturo = dataTreino >= hoje;
            console.log(`Treino ${t.id}: ${t.data} (${dataTreino.toISOString()}) - É futuro? ${isFuturo}`);
            return isFuturo;
          })
          .sort((a, b) => {
            const dataHoraA = new Date(a.data + 'T' + a.hora_inicio).getTime();
            const dataHoraB = new Date(b.data + 'T' + b.hora_inicio).getTime();
            return dataHoraA - dataHoraB;
          });
        
        const passados = treinos.filter(t => {
          const dataTreino = new Date(t.data);
          dataTreino.setHours(0, 0, 0, 0);
          return dataTreino < hoje;
        });
        
        const proximoTreino = futuros.length > 0 ? futuros[0] : null;
        const exibir = showAll ? treinos : futuros;
        
        console.log('Resultado da filtragem:');
        console.log('- Treinos futuros:', futuros.length, futuros);
        console.log('- Treinos passados:', passados.length, passados);
        console.log('- Próximo treino:', proximoTreino);
        console.log('- Treinos a exibir:', exibir.length, exibir);
        console.log('- Mostrar todos?', showAll);
        
        this.treinosData.set({
          todos: treinos,
          futuros: futuros,
          passados: passados,
          proximoTreino: proximoTreino,
          exibir: exibir
        });
      },
      error: (err: any) => console.error('Erro ao carregar treinos', err)
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
