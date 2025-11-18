import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TreinoService } from '../../../core/services/treino.service';
import { CentroTreinamentoService } from '../../../core/services/centro-treinamento.service';
import { Treino } from '../../../core/models/treino.model';
import { CentroTreinamento } from '../../../core/models/centro-treinamento.model';

@Component({
  selector: 'app-professor-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './professor-dashboard.component.html',
  styleUrl: './professor-dashboard.component.css'
})
export class ProfessorDashboardComponent implements OnInit {
  private fb = inject(FormBuilder);
  private treinoService = inject(TreinoService);
  private ctService = inject(CentroTreinamentoService);

  treinos = signal<Treino[]>([]);
  cts = signal<CentroTreinamento[]>([]);
  stats = signal<any>({});

  showModal = signal<boolean>(false);
  modalMode = signal<'create' | 'edit'>('create');
  editingTreinoId = signal<number | null>(null);

  treinoForm: FormGroup = this.fb.group({
    ct: ['', Validators.required],
    modalidade: ['', Validators.required],
    data: ['', Validators.required],
    hora_inicio: ['', Validators.required],
    hora_fim: ['', Validators.required],
    vagas: [10, [Validators.required, Validators.min(1)]],
    nivel: ['', Validators.required],
    observacoes: ['']
  });

  filterForm: FormGroup = this.fb.group({
    data: [''],
    ct: [''],
    period: ['']
  });

  ngOnInit(): void {
    this.loadCts();
    this.loadTreinos();
    this.loadStats();
  }

  private loadCts(): void {
    this.ctService.list().subscribe({
      next: (data) => this.cts.set(data),
      error: () => { }
    });
  }

  private loadTreinos(filters?: any): void {
    // Ajustar filtros para usar data_min e data_max ao invés de data e period
    const apiFilters: any = {};
    if (filters?.ct) apiFilters.ct = filters.ct;
    if (filters?.data) apiFilters.data_min = filters.data;

    this.treinoService.list(apiFilters).subscribe({
      next: (data) => this.treinos.set(data),
      error: () => { }
    });
  }

  private loadStats(): void {
    // Por enquanto, vamos calcular estatísticas localmente
    // TODO: Implementar endpoint de estatísticas no backend
    const stats = {
      total_treinos: this.treinos().length,
      proximos_treinos: this.treinos().filter(t => new Date(t.data) >= new Date()).length,
      total_inscritos: 0 // Precisaria de endpoint específico
    };
    this.stats.set(stats);
  }

  applyFilters(): void {
    this.loadTreinos(this.filterForm.value);
  }

  clearFilters(): void {
    this.filterForm.reset();
    this.loadTreinos();
  }

  openCreateModal(): void {
    this.modalMode.set('create');
    this.treinoForm.reset({ vagas: 10 });
    this.showModal.set(true);
  }

  openEditModal(treino: Treino): void {
    this.modalMode.set('edit');
    this.editingTreinoId.set(treino.id);
    this.treinoForm.patchValue({
      ct: treino.ct, // ct agora é o ID diretamente
      modalidade: treino.modalidade,
      data: treino.data,
      hora_inicio: treino.hora_inicio,
      hora_fim: treino.hora_fim,
      vagas: treino.vagas,
      nivel: treino.nivel,
      observacoes: treino.observacoes || ''
    });
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.treinoForm.reset();
    this.editingTreinoId.set(null);
  }

  saveTreino(): void {
    if (this.treinoForm.invalid) {
      this.treinoForm.markAllAsTouched();
      return;
    }

    // Preparar dados convertendo ct para number
    const formData = {
      ...this.treinoForm.value,
      ct: Number(this.treinoForm.value.ct),
      vagas: Number(this.treinoForm.value.vagas)
    };

    const operation = this.modalMode() === 'edit' && this.editingTreinoId()
      ? this.treinoService.update(this.editingTreinoId()!, formData)
      : this.treinoService.create(formData);

    operation.subscribe({
      next: () => {
        this.closeModal();
        this.loadTreinos();
        this.loadStats();
      },
      error: (err) => {
        console.error('Erro ao salvar treino:', err);
        alert('Erro ao salvar treino. Verifique os dados e tente novamente.');
      }
    });
  }

  deleteTreino(treinoId: number): void {
    if (!confirm('Tem certeza que deseja excluir este treino?')) return;

    this.treinoService.delete(treinoId).subscribe({
      next: () => {
        this.loadTreinos();
        this.loadStats();
      },
      error: () => alert('Erro ao excluir treino')
    });
  }
}
