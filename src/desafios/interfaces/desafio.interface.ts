import { DesafioStatus } from '../desafio-status.enum';
import { Jogador } from './../../jogadores/interfaces/jogador.interface';

export interface Desafio {
  dataHoraDesafio: Date;
  status: DesafioStatus;
  dataHoraSolicitacao: Date;
  dataHoraResposta: Date;
  solicitante: Jogador;
  categoria: string;
  partida?: string;
  jogadores: Array<Jogador>;
}
