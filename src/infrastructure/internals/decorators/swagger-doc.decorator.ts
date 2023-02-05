import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

interface ISwaggerParams {
  tag?: string;
  description?: string;
  authEnabled?: boolean;
}

export function SwaggerDoc(swaggerParams: ISwaggerParams) {
  const decorators = [
    ApiTags(swaggerParams.tag),
    ApiOperation({
      description: swaggerParams.description,
    }),
  ];
  if (swaggerParams.authEnabled) decorators.push(ApiBearerAuth());

  return applyDecorators(...decorators);
  // Requests and Response DTO schemas are recognized automatically by swagger
}
