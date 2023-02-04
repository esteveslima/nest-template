import { Exception } from '../../exception';

type IExceptionPayload = void;

export class UserNotFoundException extends Exception<IExceptionPayload> {}
