import { Module } from '@nestjs/common';
import { SessionGateway } from './session/session.gateway';
import { SessionModule } from './session/session.module';

@Module({
  imports: [SessionModule],
  controllers: [],
  providers: [SessionGateway],
})
export class AppModule {}
