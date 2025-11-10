import { Treino } from './treino.model';

export type StatusInscricao = 'CONFIRMADA' | 'PENDENTE' | 'CANCELADA';

export interface Inscricao {
  id: number;
  treino: Treino;
  aluno_id: number;
  status: StatusInscricao;
  data_inscricao: string;
}
