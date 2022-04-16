import { Module } from '@nestjs/common';
import { CategoriasModule } from './categorias/categorias.module';
import { JogadoresModule } from './jogadores/jogadores.module';
import { ClientProxySmartRanking } from './proxyrmq/client-proxy';
import { ProxyRMQModule } from './proxyrmq/proxyrmq.module';
import { AwsModule } from './aws/aws.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    CategoriasModule,
    ProxyRMQModule,
    JogadoresModule,
    AwsModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [],
  providers: [ClientProxySmartRanking],
})
export class AppModule {}
