import { Component, Input, OnInit, OnDestroy, PLATFORM_ID, inject, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import * as L from 'leaflet';
import { CentroTreinamento } from '../../../core/models/centro-treinamento.model';

@Component({
  selector: 'app-ct-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ct-map.component.html',
  styleUrl: './ct-map.component.css'
})
export class CtMapComponent implements OnInit, OnDestroy {
  @Input() cts: CentroTreinamento[] = [];
  @Input() height: string = '500px';

  private map?: L.Map;
  private markers: L.Marker[] = [];
  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);

  // Centro do Rio de Janeiro (Copacabana)
  private readonly RIO_CENTER: [number, number] = [-22.9068, -43.1729];
  private readonly DEFAULT_ZOOM = 12;
  private readonly MIN_ZOOM = 10;
  
  // Limites do Rio de Janeiro (da Barra até Niterói)
  private readonly RIO_BOUNDS: L.LatLngBoundsExpression = [
    [-23.083, -43.796], // Southwest (Barra da Tijuca)
    [-22.746, -43.098]  // Northeast (Niterói)
  ];

  loading = signal<boolean>(true);

  ngOnInit() {
    // Só inicializa o mapa no browser (não no SSR)
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.initMap();
        this.loading.set(false);
      }, 100);
    }
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
    }
  }

  private initMap() {
    // Criar mapa focado no Rio de Janeiro
    this.map = L.map('ct-map', {
      center: this.RIO_CENTER,
      zoom: this.DEFAULT_ZOOM,
      minZoom: this.MIN_ZOOM,
      maxBounds: this.RIO_BOUNDS
    });

    // Adicionar tiles do OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    // Adicionar markers dos CTs
    this.addMarkers();

    // Se houver CTs, ajustar visualização para incluir todos
    if (this.markers.length > 0) {
      const group = L.featureGroup(this.markers);
      const bounds = group.getBounds();
      
      // Só ajusta se os bounds estiverem dentro do Rio
      if (this.map.getBounds().contains(bounds)) {
        this.map.fitBounds(bounds.pad(0.1));
      }
    }
  }

  private addMarkers() {
    // Limpar markers antigos
    this.markers.forEach(marker => marker.remove());
    this.markers = [];

    // Ícone customizado com cor do Beach Buddy
    const customIcon = L.divIcon({
      className: 'custom-marker',
      html: `
        <div class="marker-pin">
          <svg width="32" height="40" viewBox="0 0 32 40" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 0C7.163 0 0 7.163 0 16c0 12 16 24 16 24s16-12 16-24c0-8.837-7.163-16-16-16z" fill="#00bcd4"/>
            <circle cx="16" cy="16" r="6" fill="white"/>
          </svg>
        </div>
      `,
      iconSize: [32, 40],
      iconAnchor: [16, 40],
      popupAnchor: [0, -40]
    });

    // Adicionar marker para cada CT com localização
    this.cts.forEach(ct => {
      if (ct.latitude && ct.longitude) {
        const marker = L.marker([ct.latitude, ct.longitude], { icon: customIcon })
          .addTo(this.map!)
          .bindPopup(this.createPopupContent(ct), {
            maxWidth: 300,
            className: 'ct-popup'
          });

        // Navegar para detalhes ao clicar no botão
        marker.on('popupopen', () => {
          const button = document.getElementById(`ct-btn-${ct.id}`);
          if (button) {
            button.addEventListener('click', (e) => {
              e.preventDefault();
              this.router.navigate(['/cts', ct.id]);
            });
          }
        });

        this.markers.push(marker);
      }
    });
  }

  private createPopupContent(ct: CentroTreinamento): string {
    const modalidades = ct.modalidades.split('\n').slice(0, 3).join(', ');
    const hasMore = ct.modalidades.split('\n').length > 3;
    
    return `
      <div class="map-popup">
        <h3>${ct.nome}</h3>
        <div class="popup-info">
          <p><strong>📍</strong> ${ct.endereco}</p>
          <p><strong>🏐</strong> ${modalidades}${hasMore ? '...' : ''}</p>
          ${ct.contato ? `<p><strong>📞</strong> ${ct.contato}</p>` : ''}
        </div>
        <button id="ct-btn-${ct.id}" class="btn-popup">
          Ver detalhes →
        </button>
      </div>
    `;
  }

  // Método público para atualizar markers quando a lista de CTs muda
  updateMarkers(cts: CentroTreinamento[]) {
    this.cts = cts;
    if (this.map) {
      this.addMarkers();
    }
  }
}
