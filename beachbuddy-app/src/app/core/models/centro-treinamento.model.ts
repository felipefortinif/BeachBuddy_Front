import { Usuario } from './user.model';

export interface CentroTreinamento {
  id: number;
  nome: string;
  endereco: string;
  contato: string;
  modalidades: string;
  cnpj?: string;
  gerente: number;
  gerente_nome?: string;
  professores?: number;
  professores_nomes?: string[];
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
