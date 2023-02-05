import { Exception } from '../../exception';

type IExceptionPayload = void;

export class AuthUnauthorizedException extends Exception<IExceptionPayload> {}
