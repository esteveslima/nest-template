import { Inject, Injectable, Logger } from '@nestjs/common';
import { BCRYPT_PROVIDER } from 'src/common/internals/providers/constants';
import { BcryptProviderType } from 'src/common/internals/providers/packages/bcrypt.provider';
import { IHashGateway } from '../../../application/ports/hash/hash-gateway.interface';
import {
  IHashGatewayCompareHashParams,
  IHashGatewayCompareHashResult,
} from '../../../application/ports/hash/methods/compare-hash.interface';
import {
  IHashGatewayHashValueParams,
  IHashGatewayHashValueResult,
} from '../../../application/ports/hash/methods/hash-value.interface';

// concrete implementation of the application hash dependency

@Injectable()
export class HashClientGateway implements IHashGateway {
  constructor(
    @Inject(BCRYPT_PROVIDER)
    private bcrypt: BcryptProviderType,
  ) {}

  async hashValue(
    params: IHashGatewayHashValueParams,
  ): Promise<IHashGatewayHashValueResult> {
    const { value } = params;

    const hash = await this.bcrypt.hash(value, 10);

    return hash;
  }

  async compareHash(
    params: IHashGatewayCompareHashParams,
  ): Promise<IHashGatewayCompareHashResult> {
    const { hash, value } = params;

    if (!value || !hash) return false;

    const comparitionResult = await this.bcrypt.compare(value, hash);

    return comparitionResult;
  }
}
