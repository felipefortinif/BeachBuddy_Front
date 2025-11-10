import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-signup-gerente',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './signup-gerente.component.html',
  styleUrl: './signup-gerente.component.css'
})
export class SignupGerenteComponent {
  private fb = inject(FormBuilder);
  authService = inject(AuthService);
  private router = inject(Router);

  errorMessage = signal<string>('');

  signupForm: FormGroup = this.fb.group({
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    first_name: ['', Validators.required],
    last_name: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]],
    password2: ['', Validators.required]
  }, { validators: this.passwordMatchValidator });

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const password2 = form.get('password2');
    
    if (password && password2 && password.value !== password2.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    this.errorMessage.set('');
    
    const data = {
      ...this.signupForm.value,
      tipo: 'GERENTE' as const
    };

    this.authService.signup(data).subscribe({
      next: () => {
        this.router.navigate(['/gerente/meus-cts']);
      },
      error: (err) => {
        this.errorMessage.set('Erro ao criar conta. Tente novamente.');
      }
    });
  }
}
