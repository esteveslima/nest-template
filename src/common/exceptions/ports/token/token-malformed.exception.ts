import { Exception } from '../../exception';

type IExceptionPayload = void;

export class TokenMalformedException extends Exception<IExceptionPayload> {}
