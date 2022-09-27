import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { AtualizarJogadorDto } from './dtos/atualizar-jogador.dto';
import { ClientProxySmartRanking } from '../proxyrmq/client-proxy';
import { AwsService } from '../aws/aws.service';
import { Jogador } from '../jogadores/interfaces/jogador.interface';
import { Categoria } from '../categorias/interfaces/categoria.interface';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class JogadoresService {
  private logger = new Logger(JogadoresService.name);

  constructor(
    private clientProxySmartRanking: ClientProxySmartRanking,
    private awsService: AwsService,
  ) {}

  private clientAdminBackend =
    this.clientProxySmartRanking.getClientProxyAdminBackendInstance();

  async criarJogador(criarJogadorDto: CriarJogadorDto) {
    this.logger.log(`criarJogadorDto: ${JSON.stringify(criarJogadorDto)}`);

    const categoria: Categoria = await lastValueFrom(
      this.clientAdminBackend.send(
        'consultar-categorias',
        criarJogadorDto.categoria,
      ),
    );

    if (categoria) {
      await this.clientAdminBackend.emit('criar-jogador', criarJogadorDto);
    } else {
      throw new BadRequestException(`Categoria não cadastrada!`);
    }
  }

  async uploadArquivo(file, _id: string): Promise<any> {
    //Verificar se o jogador está cadastrado
    const jogador: Jogador = await lastValueFrom(
      this.clientAdminBackend.send('consultar-jogadores', _id),
    );

    if (!jogador) {
      throw new BadRequestException(`Jogador não encontrado!`);
    }

    //Enviar o arquivo para o S3 e recuperar a URL de acesso
    const urlFotoJogador: { url: '' } = await this.awsService.uploadArquivo(
      file,
      _id,
    );

    //Atualizar o atributo URL da entidade jogador
    const atualizarJogadorDto: AtualizarJogadorDto = {};
    atualizarJogadorDto.urlFotoJogador = urlFotoJogador.url;

    await this.clientAdminBackend.emit('atualizar-jogador', {
      id: _id,
      jogador: atualizarJogadorDto,
    });

    //Retornar o jogador atualizado para o cliente
    return await lastValueFrom(
      this.clientAdminBackend.send('consultar-jogadores', _id),
    );
  }

  async consultarJogadores(_id: string): Promise<any> {
    return await lastValueFrom(
      this.clientAdminBackend.send('consultar-jogadores', _id ? _id : ''),
    );
  }

  async atualizarJogador(
    atualizarJogadorDto: AtualizarJogadorDto,
    _id: string,
  ) {
    const categoria: Categoria = await lastValueFrom(
      this.clientAdminBackend.send(
        'consultar-categorias',
        atualizarJogadorDto.categoria,
      ),
    );

    if (categoria) {
      await this.clientAdminBackend.emit('atualizar-jogador', {
        id: _id,
        jogador: atualizarJogadorDto,
      });
    } else {
      throw new BadRequestException(`Categoria não cadastrada!`);
    }
  }

  deletarJogador(_id: string) {
    this.clientAdminBackend.emit('deletar-jogador', { _id });
  }
}
