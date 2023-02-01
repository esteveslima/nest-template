import {
  IHashGatewayCompareHashParams,
  IHashGatewayCompareHashResult,
} from './methods/compare-hash.interface';
import {
  IHashGatewayHashValueParams,
  IHashGatewayHashValueResult,
} from './methods/hash-value.interface';

// hashing process only concern the application, so its interface is defined here

export abstract class IHashGateway {
  hashValue: (
    params: IHashGatewayHashValueParams,
  ) => Promise<IHashGatewayHashValueResult>;
  compareHash: (
    params: IHashGatewayCompareHashParams,
  ) => Promise<IHashGatewayCompareHashResult>;
}
