import { Component, inject, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  authService = inject(AuthService);

  constructor() {
    // Effect para debug
    effect(() => {
      const user = this.authService.currentUser();
      console.log('Header - User:', user);
      console.log('Header - isAuthenticated:', this.authService.isAuthenticated());
      console.log('Header - isAluno:', this.authService.isAluno());
      console.log('Header - isProfessor:', this.authService.isProfessor());
      console.log('Header - isGerente:', this.authService.isGerente());
    });
  }

  ngOnInit(): void {
    console.log('HeaderComponent initialized');
  }

  logout(): void {
    this.authService.logout();
  }
}
