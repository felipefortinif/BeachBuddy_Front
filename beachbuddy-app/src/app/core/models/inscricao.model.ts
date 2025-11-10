import { Treino } from './treino.model';

export type StatusInscricao = 'CONFIRMADA' | 'PENDENTE' | 'CANCELADA';

export interface Inscricao {
  id: number;
  treino: number; // ID do treino (API retorna apenas o ID)
  treino_detalhes?: { // Detalhes do treino (quando incluído na resposta)
    titulo: string;
    data: string;
    hora_inicio: string;
    hora_fim: string;
    ct_nome: string;
  };
  aluno: number; // ID do aluno
  aluno_nome?: string; // Nome do aluno (quando incluído)
  status: StatusInscricao;
  data_inscricao: string;
}
