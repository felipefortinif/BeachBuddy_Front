import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PerfilService } from '../../../core/services/perfil.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-perfil-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './perfil-detail.component.html',
  styleUrl: './perfil-detail.component.css'
})
export class PerfilDetailComponent implements OnInit {
  private perfilService = inject(PerfilService);
  private authService = inject(AuthService);

  perfil = signal<any>(null);
  displayName = computed(() => {
    const user = this.perfil();
    if (!user) return '';
    return user.first_name && user.last_name 
      ? `${user.first_name} ${user.last_name}` 
      : user.username;
  });

  ngOnInit(): void {
    this.perfilService.get().subscribe({
      next: (data) => this.perfil.set(data),
      error: () => {}
    });
  }
}
