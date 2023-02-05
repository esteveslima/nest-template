// Wrapping npm package as custom provider, allowing DI

import { Provider } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { BCRYPT_PROVIDER } from '../constants';

export type BcryptProviderType = typeof bcrypt;
const BcryptProviderToken = BCRYPT_PROVIDER;

export const BcryptCustomProvider: Provider<typeof bcrypt> = {
  provide: BcryptProviderToken,
  useValue: bcrypt,
};
