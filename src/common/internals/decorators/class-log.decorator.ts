// Disabled, left for future reference

// // Custom typescript decorator, wraps class method handlers with custom code(simple logging)

// /* eslint-disable @typescript-eslint/ban-types */
// export const ClassLogDecorator =
//   (data?: any) =>
//   (target: Function): void => {
//     const decoratedClass = target.prototype;
//     const allClassPropertyNames = Object.getOwnPropertyNames(decoratedClass);
//     const classMethodsNames = allClassPropertyNames.filter((propertyName) => {
//       if (propertyName === 'constructor') return false;
//       const descriptor = Object.getOwnPropertyDescriptor(
//         decoratedClass,
//         propertyName,
//       );
//       const isMethod = descriptor.value instanceof Function;
//       return isMethod;
//     });

//     classMethodsNames.forEach((methodName) => {
//       const descriptor = Object.getOwnPropertyDescriptor(
//         decoratedClass,
//         methodName,
//       );
//       const originalMethod = descriptor.value;
//       descriptor.value = async function (...params: any[]) {
//         //
//         try {
//           console.log(`params: ${JSON.stringify(params)}`);
//           const result = (await originalMethod.call(this, params))[0];
//           console.log(`result: ${JSON.stringify(result)}`);
//           return result;
//         } catch (e) {
//           console.log(`exception: ${JSON.stringify(e)}`);
//           throw e;
//         }
//         //
//       };

//       Object.defineProperty(decoratedClass, methodName, descriptor);
//     });
//   };
