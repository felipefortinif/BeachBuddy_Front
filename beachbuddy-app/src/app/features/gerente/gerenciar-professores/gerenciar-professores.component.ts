import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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

  ngOnInit(): void {
    this.ctId = Number(this.route.snapshot.paramMap.get('id'));

    this.perfilService.getAllProfessores().subscribe({
      next: (data) => this.todosProfessores.set(data),
      error: () => {}
    });

    this.ctService.getProfessores(this.ctId).subscribe({
      next: (data: any) => {
        this.ctNome.set(data.ct.nome);
        this.professoresAtuais.set(data.professores || []);
        const ids = data.professores.map((p: any) => p.id);
        this.professoresForm.patchValue({ professores: ids });
      },
      error: () => {}
    });
  }

  onSubmit(): void {
    if (this.professoresForm.invalid) return;

    const professorIds = this.professoresForm.value.professores;
    
    this.ctService.updateProfessores(this.ctId, professorIds).subscribe({
      next: () => {
        alert('Professores atualizados com sucesso!');
        this.router.navigate(['/gerente/meus-cts']);
      },
      error: () => alert('Erro ao atualizar professores')
    });
  }
}
