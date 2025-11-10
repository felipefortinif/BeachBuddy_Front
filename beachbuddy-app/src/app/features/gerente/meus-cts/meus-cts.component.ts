import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CentroTreinamentoService } from '../../../core/services/centro-treinamento.service';

@Component({
  selector: 'app-meus-cts',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './meus-cts.component.html',
  styleUrl: './meus-cts.component.css'
})
export class MeusCtsComponent implements OnInit {
  private ctService = inject(CentroTreinamentoService);

  cts = signal<any[]>([]);
  stats = signal<any>({});

  ngOnInit(): void {
    this.ctService.getMeusCts().subscribe({
      next: (data: any) => {
        this.cts.set(data.cts || []);
        this.stats.set(data.stats || {});
      },
      error: (err) => console.error('Erro ao carregar CTs', err)
    });
  }
}
