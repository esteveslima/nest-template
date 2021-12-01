// Interceptor to prune serialize outgoing responses, removing unwanted properties from object
// This applies only at the controller level, for other layers it should be implemented this interceptor logic locally on the code

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { map, Observable } from 'rxjs';
import { IClassConstructor } from '../interfaces/class-constructor.interface';

@Injectable()
export class SerializeOutputInterceptor implements NestInterceptor {
  constructor(private dto: IClassConstructor) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Runs BEFORE the route handler

    return next.handle().pipe(
      // Runs AFTER the route handler
      map((data: any) => {
        return plainToClass(this.dto, data, { excludeExtraneousValues: true }); // To keep properties, it is required to set the Expose decorator
      }),
    );
  }
}
