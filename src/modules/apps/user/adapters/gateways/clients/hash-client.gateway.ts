import { Inject, Injectable, Logger } from '@nestjs/common';
import { BCRYPT_PROVIDER } from 'src/common/internals/providers/constants';
import { BcryptProviderType } from 'src/common/internals/providers/packages/bcrypt.provider';
import { HashGateway } from '../../../application/interfaces/ports/hash/hash-gateway.interface';
import {
  HashGatewayCompareHashParams,
  HashGatewayCompareHashResult,
} from '../../../application/interfaces/ports/hash/methods/compare-hash.interface';
import {
  HashGatewayHashValueParams,
  HashGatewayHashValueResult,
} from '../../../application/interfaces/ports/hash/methods/hash-value.interface';

// concrete implementation of the application hash dependency

@Injectable()
export class HashGatewayGateway implements HashGateway {
  constructor(
    @Inject(BCRYPT_PROVIDER)
    private bcrypt: BcryptProviderType,
  ) {}

  async hashValue(
    params: HashGatewayHashValueParams,
  ): Promise<HashGatewayHashValueResult> {
    const { value } = params;

    const hash = await this.bcrypt.hash(value, 10);

    return hash;
  }

  async compareHash(
    params: HashGatewayCompareHashParams,
  ): Promise<HashGatewayCompareHashResult> {
    const { hash, value } = params;

    if (!value || !hash) return false;

    const comparitionResult = await this.bcrypt.compare(value, hash);

    return comparitionResult;
  }
}
