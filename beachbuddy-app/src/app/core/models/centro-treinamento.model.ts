import { Usuario } from './user.model';

export interface CentroTreinamento {
  id: number;
  nome: string;
  endereco: string;
  contato: string;
  modalidades: string;
  cnpj?: string;
  gerente_id: number;
  gerente?: Usuario;
  professores?: Usuario[];
  professores_total?: number;
  upcoming_treinos?: number;
  treinos_futuros?: number;
}

export interface CentroTreinamentoForm {
  nome: string;
  endereco: string;
  contato: string;
  modalidades: string;
  cnpj?: string;
}
