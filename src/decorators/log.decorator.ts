// Create decorator to apply log interceptor

import { UseInterceptors } from '@nestjs/common';
import { LogInterceptor } from '../interceptors/log.interceptor';

export const Log = (logContext: string, verbose?: boolean) =>
  UseInterceptors(new LogInterceptor(logContext, verbose));
