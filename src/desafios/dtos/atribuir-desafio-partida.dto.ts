import { Jogador } from './../../jogadores/interfaces/jogador.interface';
import { IsNotEmpty } from 'class-validator';
import { Resultado } from '../interfaces/partida.interface';

export class AtribuirDesafioPartidaDto {
  @IsNotEmpty()
  def: Jogador;

  @IsNotEmpty()
  resultado: Array<Resultado>;
}
