import { Exception } from '../../exception';

interface IExceptionPayload {
  username: string;
  email: string;
}

export class UserAlreadyExistsException extends Exception<IExceptionPayload> {}
