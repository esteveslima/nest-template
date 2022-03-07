import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashService {
  async hashValue(value: string): Promise<string> {
    if (!value) return undefined;
    return bcrypt.hash(value, 10);
  }
  async compareHash(value: string, hash: string): Promise<boolean> {
    if (!value || !hash) return false;
    return bcrypt.compare(value, hash);
  }
}
