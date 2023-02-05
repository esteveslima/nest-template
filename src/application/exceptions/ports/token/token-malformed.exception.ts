import { Exception } from '../../../../domain/entities/exception';

type IExceptionPayload = void;

export class TokenMalformedException extends Exception<IExceptionPayload> {}
