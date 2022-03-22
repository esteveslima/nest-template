// Disabled, left for future reference

// // Custom typescript decorator, wraps method handler with custom code(simple logging)

// export const MethodLogDecorator =
//   (data?: any) =>
//   (
//     target: any,
//     propertyKey: string,
//     descriptor: TypedPropertyDescriptor<any>,
//   ): void => {
//     const originalMethod = target[propertyKey];
//     descriptor.value = async function (...params: any[]) {
//       //
//       try {
//         console.log(`params: ${JSON.stringify(params)}`);
//         const result = (await originalMethod.call(this, params))[0];
//         console.log(`result: ${JSON.stringify(result)}`);
//         return result;
//       } catch (e) {
//         console.log(`exception: ${JSON.stringify(e)}`);
//         throw e;
//       }
//       //
//     };
//   };
