import { Exception } from '../../exception';

type IExceptionPayload = void;

export class UserSearchInvalidFiltersException extends Exception<IExceptionPayload> {}
