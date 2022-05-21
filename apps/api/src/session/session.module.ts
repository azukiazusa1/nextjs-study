import { Module } from '@nestjs/common';
import { SessionGateway } from './session.gateway';
import { SessionRepository } from './session.repository';
import { SessionService } from './session.service';

@Module({
  providers: [SessionGateway, SessionService, SessionRepository],
})
export class SessionModule {}
