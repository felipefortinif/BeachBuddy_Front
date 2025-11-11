import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CentroTreinamentoService } from '../../../core/services/centro-treinamento.service';
import { CentroTreinamento } from '../../../core/models/centro-treinamento.model';

@Component({
  selector: 'app-escolher-ct',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './escolher-ct.component.html',
  styleUrl: './escolher-ct.component.css'
})
export class EscolherCtComponent implements OnInit {
  private ctService = inject(CentroTreinamentoService);

  cts = signal<CentroTreinamento[]>([]);

  ngOnInit(): void {
    this.ctService.list().subscribe({
      next: (response: any) => {
        const ctsArray = response.results || [];
        this.cts.set(ctsArray);
      },
      error: (err) => console.error('Erro ao carregar CTs:', err)
    });
  }
}
