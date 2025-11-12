import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { CentroTreinamentoService } from '../../../core/services/centro-treinamento.service';
import { PerfilService } from '../../../core/services/perfil.service';

@Component({
  selector: 'app-gerenciar-professores',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './gerenciar-professores.component.html',
  styleUrl: './gerenciar-professores.component.css'
})
export class GerenciarProfessoresComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private ctService = inject(CentroTreinamentoService);
  private perfilService = inject(PerfilService);

  ctNome = signal<string>('');
  todosProfessores = signal<any[]>([]);
  professoresAtuais = signal<any[]>([]);
  ctId: number = 0;

  professoresForm: FormGroup = this.fb.group({
    professores: [[], Validators.required]
  });

  constructor() {
    // Atualizar lista de professores atuais quando o formulário mudar
    this.professoresForm.get('professores')?.valueChanges.subscribe(() => {
      this.atualizarProfessoresAtuais();
    });
  }

  ngOnInit(): void {
    this.ctId = Number(this.route.snapshot.paramMap.get('id'));

    // Buscar todos os professores disponíveis
    this.perfilService.getAllProfessores().subscribe({
      next: (data) => {
        this.todosProfessores.set(data);
      },
      error: (err) => {
        alert('Erro ao carregar lista de professores.');
      }
    });

    // Buscar dados do CT incluindo professores atuais
    this.ctService.get(this.ctId).subscribe({
      next: (data: any) => {
        this.ctNome.set(data.nome);
        
        // A API retorna os IDs dos professores em data.professores
        const professorIds = data.professores || [];
        this.professoresForm.patchValue({ professores: professorIds });
        
        // Filtrar professores atuais para exibição
        this.atualizarProfessoresAtuais();
      },
      error: (err) => {
        alert('Erro ao carregar dados do CT.');
      }
    });
  }

  private atualizarProfessoresAtuais(): void {
    const idsAtuais = this.professoresForm.value.professores || [];
    const professoresAtuais = this.todosProfessores().filter(p => idsAtuais.includes(p.id));
    this.professoresAtuais.set(professoresAtuais);
  }

  onSubmit(): void {
    if (this.professoresForm.invalid) return;

    const novosIds: number[] = this.professoresForm.value.professores;
    const idsAtuais: number[] = this.professoresAtuais().map(p => p.id);

    // Descobrir quem adicionar e quem remover
    const paraAdicionar = novosIds.filter(id => !idsAtuais.includes(id));
    const paraRemover = idsAtuais.filter(id => !novosIds.includes(id));

    console.log('Para adicionar:', paraAdicionar);
    console.log('Para remover:', paraRemover);

    // Criar array de observables para todas as operações
    const operacoes: any[] = [];

    paraAdicionar.forEach(professorId => {
      operacoes.push(
        this.ctService.addProfessor(this.ctId, professorId)
      );
    });

    paraRemover.forEach(professorId => {
      operacoes.push(
        this.ctService.removeProfessor(this.ctId, professorId)
      );
    });

    // Se não há mudanças, apenas voltar
    if (operacoes.length === 0) {
      alert('Nenhuma alteração foi feita.');
      this.router.navigate(['/gerente/meus-cts']);
      return;
    }

    // Executar todas as operações em paralelo
    forkJoin(operacoes).subscribe({
      next: () => {
        alert('Professores atualizados com sucesso!');
        this.router.navigate(['/gerente/meus-cts']);
      },
      error: (err) => {
        console.error('Erro ao atualizar professores:', err);
        alert('Erro ao atualizar professores. Tente novamente.');
      }
    });
  }
}
