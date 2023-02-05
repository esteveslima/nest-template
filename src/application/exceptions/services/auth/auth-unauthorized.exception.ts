import { Exception } from '../../../../domain/entities/exception';

type IExceptionPayload = void;

export class AuthUnauthorizedException extends Exception<IExceptionPayload> {}
