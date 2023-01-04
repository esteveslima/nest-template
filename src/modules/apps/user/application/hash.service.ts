import { Inject, Injectable, Logger } from '@nestjs/common';
import { BCRYPT_PROVIDER } from 'src/common/internals/providers/constants';
import { TypeBcryptProvider } from 'src/common/internals/providers/packages/bcrypt.provider';

@Injectable()
export class HashService {
  constructor(
    @Inject(BCRYPT_PROVIDER)
    private bcrypt: TypeBcryptProvider,
  ) {}

  async hashValue(value: string): Promise<string> {
    return await this.bcrypt.hash(value, 10);
  }

  async compareHash(value: string, hash: string): Promise<boolean> {
    if (!value || !hash) return false;
    return await this.bcrypt.compare(value, hash);
  }
}
