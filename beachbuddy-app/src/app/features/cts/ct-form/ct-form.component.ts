import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CentroTreinamentoService } from '../../../core/services/centro-treinamento.service';

@Component({
  selector: 'app-ct-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './ct-form.component.html',
  styleUrl: './ct-form.component.css'
})
export class CtFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private ctService = inject(CentroTreinamentoService);

  isEdit = signal<boolean>(false);
  errorMessage = signal<string>('');
  ctId: number | null = null;

  ctForm: FormGroup = this.fb.group({
    nome: ['', Validators.required],
    endereco: ['', Validators.required],
    contato: ['', Validators.required],
    cnpj: [''],
    modalidades: ['', Validators.required]
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit.set(true);
      this.ctId = Number(id);
      this.loadCt(this.ctId);
    }
  }

  private loadCt(id: number): void {
    this.ctService.get(id).subscribe({
      next: (data) => {
        this.ctForm.patchValue(data.ct);
      },
      error: () => this.errorMessage.set('Erro ao carregar CT')
    });
  }

  onSubmit(): void {
    if (this.ctForm.invalid) {
      this.ctForm.markAllAsTouched();
      return;
    }

    const operation = this.isEdit() && this.ctId
      ? this.ctService.update(this.ctId, this.ctForm.value)
      : this.ctService.create(this.ctForm.value);

    operation.subscribe({
      next: () => this.router.navigate(['/gerente/meus-cts']),
      error: () => this.errorMessage.set('Erro ao salvar CT')
    });
  }
}
