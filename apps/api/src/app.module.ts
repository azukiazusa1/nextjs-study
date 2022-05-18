import { Module } from '@nestjs/common';
import { SessionGateway } from './session/session.gateway';
import { SessionModule } from './session/session.module';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { ConfigModule } from '@nestjs/config';
import { SessionService } from './session/session.service';
import { SessionRepository } from './session/session.repository';

@Module({
  imports: [
    ConfigModule.forRoot(),
    RedisModule.forRoot({
      readyLog: true,
      config: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        password: process.env.REDIS_PASSWORD,
      },
    }),
    SessionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
