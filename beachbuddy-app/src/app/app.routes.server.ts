import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'cts/:id',
    renderMode: RenderMode.Client 
  },
  {
    path: 'cts/:id/editar',
    renderMode: RenderMode.Client 
  },
  {
    path: 'aluno/novo-treino/:ctId',
    renderMode: RenderMode.Client
  },
  {
    path: 'gerente/cts/:id/professores',
    renderMode: RenderMode.Client
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
