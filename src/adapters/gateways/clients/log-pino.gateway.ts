import { Inject, Injectable, Logger } from '@nestjs/common';
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

@Injectable()
export class LogPinoGateway implements ILogGateway {
  private readonly logger = new Logger();

  constructor() {
    //
  }

  async log(params: ILogGatewayLogParams): Promise<ILogGatewayLogResult> {
    this.logger.log(params);
  }

  async error(params: ILogGatewayErrorParams): Promise<ILogGatewayErrorResult> {
    this.logger.error(params);
  }
}
