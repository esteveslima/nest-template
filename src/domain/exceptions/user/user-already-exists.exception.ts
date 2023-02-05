import { Exception } from '../../entities/exception';

interface IExceptionPayload {
  username: string;
  email: string;
}

export class UserAlreadyExistsException extends Exception<IExceptionPayload> {}
