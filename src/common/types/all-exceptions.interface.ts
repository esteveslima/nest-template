import { AdapterExceptions } from '../exceptions/adapter-exceptions';
import { ApplicationExceptions } from '../exceptions/application-exceptions';
import { DomainExceptions } from '../exceptions/domain-exceptions';

export type AllExceptions = typeof DomainExceptions &
  typeof ApplicationExceptions &
  typeof AdapterExceptions;
