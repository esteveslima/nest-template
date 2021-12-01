// Create decorator to apply log interceptor

import { UseInterceptors } from '@nestjs/common';
import { SerializeOutputInterceptor } from '../interceptors/serialize-output.interceptor';
import { IClassConstructor } from '../interfaces/class-constructor.interface';

export const SerializeOutput = (dto: IClassConstructor) =>
  UseInterceptors(new SerializeOutputInterceptor(dto));

// export function Serialize(dto: IClassConstructor) {
//   return applyDecorators(
//     UseInterceptors(ClassSerializerInterceptor), // built-in interceptor for serializing incoming requests and apply transformation decorator rules
//     UseInterceptors(new SerializeOutputInterceptor(dto)), // serialize output response, removing unwanted properties
//   );
// }
