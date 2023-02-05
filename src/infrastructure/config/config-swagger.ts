import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const configSwagger = (app: INestApplication, route: string): void => {
  const swaggerDocumentConfig = new DocumentBuilder()
    .setTitle('media-collection')
    .setVersion('0.0.0')
    .setDescription('Practice template project on Nest.js')
    .addBearerAuth({ type: 'http', scheme: 'Bearer', bearerFormat: 'JWT' })
    .build();

  const swaggerDocument = SwaggerModule.createDocument(
    app,
    swaggerDocumentConfig,
  );

  SwaggerModule.setup(route, app, swaggerDocument, {
    swaggerOptions: { defaultModelsExpandDepth: 0 },
  });
};
