import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  authService = inject(AuthService);
  private router = inject(Router);

  errorMessage = signal<string>('');

  loginForm: FormGroup = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.errorMessage.set('');
    
    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        // Redirecionar baseado no tipo de usuário
        const user = this.authService.currentUser();
        if (user?.usuario.tipo === 'ALUNO') {
          this.router.navigate(['/aluno/meus-treinos']);
        } else if (user?.usuario.tipo === 'PROFESSOR') {
          this.router.navigate(['/professor/dashboard']);
        } else if (user?.usuario.tipo === 'GERENTE') {
          this.router.navigate(['/gerente/meus-cts']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        this.errorMessage.set('Usuário ou senha inválidos');
      }
    });
  }
}
