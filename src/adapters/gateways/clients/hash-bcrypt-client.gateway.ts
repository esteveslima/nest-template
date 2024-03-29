import { Inject, Injectable } from '@nestjs/common';
import { IHashGateway } from 'src/application/interfaces/ports/hash/hash-gateway.interface';
import {
  IHashGatewayCompareHashParams,
  IHashGatewayCompareHashResult,
} from 'src/application/interfaces/ports/hash/methods/compare-hash.interface';
import {
  IHashGatewayHashValueParams,
  IHashGatewayHashValueResult,
} from 'src/application/interfaces/ports/hash/methods/hash-value.interface';
import { BCRYPT_PROVIDER } from 'src/infrastructure/internals/providers/constants';
import { BcryptProviderType } from 'src/infrastructure/internals/providers/packages/bcrypt.provider';

// concrete implementation of the application hash dependency
// ideally this layer should also deppend on interfaces, but currently ignoring the dependency rule on this layer towards a more pragmatic approach

@Injectable()
export class HashBcryptClientGateway implements IHashGateway {
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
