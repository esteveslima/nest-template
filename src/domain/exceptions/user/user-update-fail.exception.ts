import { Exception } from '../../entities/exception';

type IExceptionPayload = void;

export class UserUpdateFailException extends Exception<IExceptionPayload> {}
