import {
  HashGatewayCompareHashParams,
  HashGatewayCompareHashResult,
} from './methods/compare-hash.interface';
import {
  HashGatewayHashValueParams,
  HashGatewayHashValueResult,
} from './methods/hash-value.interface';

// hashing process only concern the application, so its interface is defined here

export abstract class HashGateway {
  hashValue: (
    params: HashGatewayHashValueParams,
  ) => Promise<HashGatewayHashValueResult>;
  compareHash: (
    params: HashGatewayCompareHashParams,
  ) => Promise<HashGatewayCompareHashResult>;
}
