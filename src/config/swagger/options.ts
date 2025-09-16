import { DocumentBuilder } from '@nestjs/swagger';
import * as project from 'package.json';

export const SWAGGER_API_KEY_NAME = 'apiKey';

export const documentBuilderOptions = new DocumentBuilder()
  .addServer('http')
  .addBearerAuth()
  .addApiKey(
    { type: 'apiKey', name: 'X-API-KEY', in: 'header' },
    SWAGGER_API_KEY_NAME,
  )
  .setTitle(project.name)
  .setDescription(`API documents`)
  .setVersion(project.version)
  .build();
