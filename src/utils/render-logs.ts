import { NestExpressApplication } from '@nestjs/platform-express';

export async function renderLogs(
  app: NestExpressApplication,
  swaggerRoutePrefix: string,
) {
  console.log(
    `(${process.env.DIGILAB_NODE_ENV}) Api is running on: ${(await app.getUrl()).toString()}`,
  );
  console.log(
    `(${process.env.DIGILAB_NODE_ENV}) Swagger is running on: ${(await app.getUrl()).toString()}/${swaggerRoutePrefix}`,
  );
}
