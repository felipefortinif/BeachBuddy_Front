import { CentroTreinamento } from './centro-treinamento.model';
import { Usuario } from './user.model';

export interface Treino {
  id: number;
  ct: number; // ID do CT
  ct_nome: string; // Nome do CT
  professor: number; // ID do professor
  professor_nome: string; // Nome do professor
  modalidade: string;
  data: string; // YYYY-MM-DD
  hora_inicio: string; // HH:MM:SS
  hora_fim: string; // HH:MM:SS
  vagas: number;
  vagas_disponiveis: number;
  nivel: string;
  observacoes?: string;
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
