import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PerfilService } from '../../../core/services/perfil.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-perfil-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './perfil-form.component.html',
  styleUrl: './perfil-form.component.css'
})
export class PerfilFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private perfilService = inject(PerfilService);
  private authService = inject(AuthService);

  errorMessage = signal<string>('');
  isProfessor = signal<boolean>(false);

  perfilForm: FormGroup = this.fb.group({
    first_name: [''],
    last_name: [''],
    email: ['', Validators.email],
    telefone: [''],
    nivel: [''],
    certificacoes: ['']
  });

  ngOnInit(): void {
    this.isProfessor.set(this.authService.isProfessor());

    this.perfilService.get().subscribe({
      next: (data) => {
        this.perfilForm.patchValue({
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          telefone: data.usuario.telefone || '',
          nivel: data.usuario.nivel || '',
          certificacoes: data.usuario.certificacoes || ''
        });
      },
      error: () => {}
    });
  }

  onSubmit(): void {
    if (this.perfilForm.invalid) {
      this.perfilForm.markAllAsTouched();
      return;
    }

    this.perfilService.update(this.perfilForm.value).subscribe({
      next: (data) => {
        this.authService.updateCurrentUser(data);
        this.router.navigate(['/perfil']);
      },
      error: () => this.errorMessage.set('Erro ao atualizar perfil')
    });
  }
}
