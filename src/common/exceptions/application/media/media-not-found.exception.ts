import { Exception } from '../../exception';

type IExceptionPayload = void;

export class MediaNotFoundException extends Exception<IExceptionPayload> {}
