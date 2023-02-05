import { Exception } from '../../entities/exception';

type IExceptionPayload = void;

export class UserNotFoundException extends Exception<IExceptionPayload> {}
