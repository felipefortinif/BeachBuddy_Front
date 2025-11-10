import { CentroTreinamento } from './centro-treinamento.model';
import { Usuario } from './user.model';

export interface Treino {
  id: number;
  ct: CentroTreinamento;
  ct_id: number;
  professor: Usuario;
  professor_id: number;
  modalidade: string;
  data: string;
  hora_inicio: string;
  hora_fim: string;
  vagas: number;
  nivel: string;
  observacoes?: string;
  confirmadas: number;
  vagas_disponiveis: number;
}

export interface TreinoForm {
  ct: number;
  modalidade: string;
  data: string;
  hora_inicio: string;
  hora_fim: string;
  vagas: number;
  nivel: string;
  observacoes?: string;
}
