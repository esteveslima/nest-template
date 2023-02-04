import { Exception } from '../../exception';

type IExceptionPayload = void;

export class TokenPayloadInvalidException extends Exception<IExceptionPayload> {}
