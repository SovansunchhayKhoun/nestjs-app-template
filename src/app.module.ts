import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DatabaseModule } from './config/database/database.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { EnvironmentVariables } from './common/types/env';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppLoggerModule } from './common/services/app-logger.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({ isGlobal: true, envFilePath: `.env`, cache: false }),
    EventEmitterModule.forRoot({ global: true }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<EnvironmentVariables>) => ({
        throttlers: [
          {
            ttl: Number(configService.get('NEST_TEMP_THROTTLE_TTL')),
            limit: Number(configService.get('NEST_TEMP_THROTTLE_LIMIT')),
          },
        ],
      }),
      inject: [ConfigService],
    }),
    AppLoggerModule,
  ],
  controllers: [AppController],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
