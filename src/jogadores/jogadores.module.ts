import { AwsModule } from './../aws/aws.module';
import { Module } from '@nestjs/common';
import { JogadoresController } from './jogadores.controller';
import { ProxyRMQModule } from '../proxyrmq/proxyrmq.module';

@Module({
  imports: [ProxyRMQModule, AwsModule],
  controllers: [JogadoresController],
})
export class JogadoresModule {}
