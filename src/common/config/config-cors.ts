import { INestApplication } from '@nestjs/common';

export const configCors = (
  app: INestApplication,
  allowedDomains: string[],
): void => {
  app.enableCors({
    origin: allowedDomains.map(
      (allowedDomain) =>
        new RegExp(
          '^https?:\\/\\/(.*).?[ALLOWED_DOMAIN](:\\d{4})?$'.replace(
            '[ALLOWED_DOMAIN]',
            allowedDomain,
          ),
        ),
    ),
    methods: ['HEAD', 'OPTIONS', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });
};
