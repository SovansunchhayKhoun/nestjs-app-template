import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { EnvironmentVariables } from './common/types/env';
import { ConfigService } from '@nestjs/config';
import { documentBuilderOptions } from './config/swagger/options';
import { SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { AllExceptionsFilter } from './common/interceptors/catch-everything';
import { AppLogger } from './common/services/app-logger.service';
import { ValidationPipe } from '@nestjs/common';
import { renderLogs } from './utils/render-logs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: {
      origin: '*',
      credentials: true,
    },
  });

  app.set('query parser', 'extended');
  const configService = app.get(ConfigService<EnvironmentVariables>);
  const documentFactory = () =>
    SwaggerModule.createDocument(app, documentBuilderOptions);
  const swaggerRoutePrefix = 'api';
  const httpAdapterHost = app.get(HttpAdapterHost);

  app.use(helmet());

  app.useGlobalFilters(
    new AllExceptionsFilter(httpAdapterHost, app.get(AppLogger)),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.use(cookieParser());
  SwaggerModule.setup(swaggerRoutePrefix, app, documentFactory, {
    swaggerOptions: { persistAuthorization: true },
    ui: configService.getOrThrow('NEST_TEMP_NODE_ENV') !== 'production',
    raw: configService.getOrThrow('NEST_TEMP_NODE_ENV') !== 'production',
    explorer: true,
    customSiteTitle: 'Swagger',
  });

  await app.listen(process.env.NEST_TEMP_PORT ?? 3000);
  await renderLogs(app, swaggerRoutePrefix);
}
void bootstrap();
