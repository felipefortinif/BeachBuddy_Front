import { Routes } from '@angular/router';
import { authGuard, guestGuard, alunoGuard, professorGuard, gerenteGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'cadastro/aluno',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/signup-aluno/signup-aluno.component').then(m => m.SignupAlunoComponent)
  },
  {
    path: 'cadastro/professor',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/signup-professor/signup-professor.component').then(m => m.SignupProfessorComponent)
  },
  {
    path: 'cadastro/gerente',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/signup-gerente/signup-gerente.component').then(m => m.SignupGerenteComponent)
  },
  {
    path: 'cts',
    loadComponent: () => import('./features/cts/ct-list/ct-list.component').then(m => m.CtListComponent)
  },
  {
    path: 'cts/:id',
    loadComponent: () => import('./features/cts/ct-detail/ct-detail.component').then(m => m.CtDetailComponent)
  },
  {
    path: 'cts/:id/editar',
    canActivate: [gerenteGuard],
    loadComponent: () => import('./features/cts/ct-form/ct-form.component').then(m => m.CtFormComponent)
  },
  {
    path: 'aluno/meus-treinos',
    canActivate: [alunoGuard],
    loadComponent: () => import('./features/aluno/meus-treinos/meus-treinos.component').then(m => m.MeusTreinosComponent)
  },
  {
    path: 'aluno/novo-treino',
    canActivate: [alunoGuard],
    loadComponent: () => import('./features/aluno/escolher-ct/escolher-ct.component').then(m => m.EscolherCtComponent)
  },
  {
    path: 'aluno/novo-treino/:ctId',
    canActivate: [alunoGuard],
    loadComponent: () => import('./features/aluno/escolher-treino/escolher-treino.component').then(m => m.EscolherTreinoComponent)
  },
  {
    path: 'professor/dashboard',
    canActivate: [professorGuard],
    loadComponent: () => import('./features/professor/professor-dashboard/professor-dashboard.component').then(m => m.ProfessorDashboardComponent)
  },
  {
    path: 'gerente/meus-cts',
    canActivate: [gerenteGuard],
    loadComponent: () => import('./features/gerente/meus-cts/meus-cts.component').then(m => m.MeusCtsComponent)
  },
  {
    path: 'gerente/novo-ct',
    canActivate: [gerenteGuard],
    loadComponent: () => import('./features/cts/ct-form/ct-form.component').then(m => m.CtFormComponent)
  },
  {
    path: 'gerente/cts/:id/professores',
    canActivate: [gerenteGuard],
    loadComponent: () => import('./features/gerente/gerenciar-professores/gerenciar-professores.component').then(m => m.GerenciarProfessoresComponent)
  },
  {
    path: 'perfil',
    canActivate: [authGuard],
    loadComponent: () => import('./features/perfil/perfil-detail/perfil-detail.component').then(m => m.PerfilDetailComponent)
  },
  {
    path: 'perfil/editar',
    canActivate: [authGuard],
    loadComponent: () => import('./features/perfil/perfil-form/perfil-form.component').then(m => m.PerfilFormComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
