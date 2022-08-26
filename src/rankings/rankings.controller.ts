import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ClientProxySmartRanking } from '../proxyrmq/client-proxy';

@Controller('api/v1/rankings')
export class RankingsController {
  constructor(private clientProxySmartRanking: ClientProxySmartRanking) {}

  private clientRanckingsBackend =
    this.clientProxySmartRanking.getClientProxyRankingsInstance();

  @Get()
  consultarRankings(
    @Query('idCategoria') idCategoria: string,
    @Query('dataRef') dataRef: string,
  ): Observable<any> {
    if (!idCategoria) {
      throw new BadRequestException('O id da categoria e obrigatorio!');
    }

    return this.clientRanckingsBackend.send('consultar-rankings', {
      idCategoria: idCategoria,
      dataRef: dataRef ? dataRef : '',
    });
  }
}
