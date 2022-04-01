// TODO: try to create service logger and apply this function to obscure sensitive data

// const blackListedProperties = ['password'];

// export const obscureBlacklistedLogProperties = (logData: any): any => {
//   if (logData instanceof Object) {
//     const obscuredLogObject = logData;
//     Object.keys(obscuredLogObject).forEach((propertyName) => {
//       if (blackListedProperties.includes(propertyName)) {
//         obscuredLogObject[propertyName] = '***obscured***';
//       }
//     });
//     return obscuredLogObject;
//   }
//   return logData;
// };

// may not be easy to create generic obscurable, access to req change the object itself and access to res body is impossible
