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
    try {
      return this.bcrypt.hash(value, 10);
    } catch (e) {
      Logger.error(e);
      throw new Error(`${e}`); // Generic opaque error with simple message and no details for uncaught exceptions, forcing to implement proper error handling if the error is required to catch by other layers
    }
  }
  async compareHash(value: string, hash: string): Promise<boolean> {
    if (!value || !hash) return false;
    try {
      return this.bcrypt.compare(value, hash);
    } catch (e) {
      Logger.error(e);
      throw new Error(`${e}`); // Generic opaque error with simple message and no details for uncaught exceptions, forcing to implement proper error handling if the error is required to catch by other layers
    }
  }
}
