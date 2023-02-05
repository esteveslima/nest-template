import { Exception } from '../../../../domain/entities/exception';

type IExceptionPayload = void;

export class UserSearchInvalidFiltersException extends Exception<IExceptionPayload> {}
