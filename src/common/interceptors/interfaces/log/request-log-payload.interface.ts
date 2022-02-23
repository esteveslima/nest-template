import { request } from 'express';
import { IAuthUser } from 'src/modules/auth/interfaces/user/user.interface';

export interface IRequestLogPayload {
  method: typeof request.route.path;
  path: typeof request.route.path;
  payload: {
    headers: typeof request.headers;
    params: typeof request.params;
    query: typeof request.query;
    body: typeof request.body;
  };
  auth: {
    user: IAuthUser;
  };
}
