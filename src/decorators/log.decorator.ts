// Create decorator to apply log interceptor

import { UseInterceptors } from '@nestjs/common';
import { LogInterceptor } from 'src/interceptors/log.interceptor';

export const Log = (logContext: string, verbose?: boolean) =>
  UseInterceptors(new LogInterceptor(logContext, verbose));
