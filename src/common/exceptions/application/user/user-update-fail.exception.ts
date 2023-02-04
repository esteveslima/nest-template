import { Exception } from '../../exception';

type IExceptionPayload = void;

export class UserUpdateFailException extends Exception<IExceptionPayload> {}
