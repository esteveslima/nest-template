import { Inject, Injectable } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { ILogGateway } from 'src/application/interfaces/ports/log/log-gateway.interface';
import {
  ILogGatewayErrorParams,
  ILogGatewayErrorResult,
} from 'src/application/interfaces/ports/log/methods/error.interface';
import {
  ILogGatewayLogParams,
  ILogGatewayLogResult,
} from 'src/application/interfaces/ports/log/methods/log.interface';

// concrete implementation of the application log dependency
// ideally this layer should also deppend on interfaces, but currently ignoring the dependency rule on this layer towards a more pragmatic approach

@Injectable()
export class LogPinoClientGateway implements ILogGateway {
  constructor(
    @InjectPinoLogger('Logger')
    private readonly logger: PinoLogger,
  ) {}

  async log(params: ILogGatewayLogParams): Promise<ILogGatewayLogResult> {
    this.logger.info(params);
  }

  async error(params: ILogGatewayErrorParams): Promise<ILogGatewayErrorResult> {
    this.logger.error(params);
  }
}
