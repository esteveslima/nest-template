/* eslint-disable @typescript-eslint/ban-types */

import { ILogPayload } from '../../../types/log-payload.interface';
import { IMinimalLogger } from '../../../types/minimal-logger.interface';

export interface ILogDecoratorOptions {
  context: ILogPayload['context'];
  operation?: ILogPayload['operation'];
  logger?: IMinimalLogger;
}
