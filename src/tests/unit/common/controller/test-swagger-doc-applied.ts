import { DECORATORS } from '@nestjs/swagger/dist/constants';

export const testSwaggerDocApplied = (method: FunctionConstructor) => {
  it(`expects ${method.name} to apply swagger documentation`, async () => {
    const swaggerSecurityApplied: unknown = Reflect.getMetadata(
      DECORATORS.API_SECURITY,
      method,
    );
    const swaggerTagApplied: unknown[] = Reflect.getMetadata(
      DECORATORS.API_TAGS,
      method,
    )[0];
    const swaggerOperationApplied: unknown = Reflect.getMetadata(
      DECORATORS.API_OPERATION,
      method,
    );

    // expect(swaggerSecurityApplied).toBeDefined();
    expect(swaggerTagApplied).toBeDefined();
    expect(swaggerOperationApplied).toEqual(
      expect.objectContaining({
        description: expect.any(String),
      }),
    );
  });
};
