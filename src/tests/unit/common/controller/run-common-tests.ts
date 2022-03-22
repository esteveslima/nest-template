// Runs common tests for all controller methods to check it's basic configuration

import { ClassConstructor } from 'class-transformer';

export const runCommonTests = (
  testClass: ClassConstructor<unknown>,
  tests: (method: FunctionConstructor) => void,
): void => {
  const testClassMethodsNames = Object.getOwnPropertyNames(
    testClass.prototype,
  ).filter((name) => name !== 'constructor');
  const testClassMethods: FunctionConstructor[] = testClassMethodsNames.map(
    (methodName) => testClass.prototype[methodName],
  );

  testClassMethods.forEach((method) => {
    tests(method);
  });
};
