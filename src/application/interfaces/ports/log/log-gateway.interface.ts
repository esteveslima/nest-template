import {
  ILogGatewayLogParams,
  ILogGatewayLogResult,
} from './methods/log.interface';
import {
  ILogGatewayErrorParams,
  ILogGatewayErrorResult,
} from './methods/error.interface';

// logging process only concern the application, so its interface is defined here

export abstract class ILogGateway {
  log: (params: ILogGatewayLogParams) => Promise<ILogGatewayLogResult>;
  error: (params: ILogGatewayErrorParams) => Promise<ILogGatewayErrorResult>;
}
