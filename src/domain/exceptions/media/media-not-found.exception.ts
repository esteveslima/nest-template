import { Exception } from '../../entities/exception';

type IExceptionPayload = void;

export class MediaNotFoundException extends Exception<IExceptionPayload> {}
