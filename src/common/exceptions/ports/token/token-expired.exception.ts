import { Exception } from '../../exception';

type IExceptionPayload = void;

export class TokenExpiredException extends Exception<IExceptionPayload> {}
