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

    // Buscar todos os professores disponíveis
    this.perfilService.getAllProfessores().subscribe({
      next: (data) => this.todosProfessores.set(data),
      error: () => {}
    });

    // Buscar dados do CT incluindo professores atuais
    this.ctService.get(this.ctId).subscribe({
      next: (data: any) => {
        this.ctNome.set(data.nome);
        // A API retorna os IDs dos professores em data.professores
        const professorIds = data.professores || [];
        this.professoresForm.patchValue({ professores: professorIds });
      },
      error: () => {}
    });
  }

  onSubmit(): void {
    if (this.professoresForm.invalid) return;

    const professorIds: number[] = this.professoresForm.value.professores;
    
    // Precisamos adicionar/remover professores individualmente
    // Por enquanto, vou simplificar comentando
    alert('Funcionalidade de gerenciar professores precisa ser implementada');
    // TODO: Implementar lógica de adicionar/remover professores usando
    // ctService.addProfessor() e ctService.removeProfessor()
  }
}
