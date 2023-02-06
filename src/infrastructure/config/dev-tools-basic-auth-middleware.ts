// Simple middleware that applies simple login/password prompt on the broswer to access developer tools

import { Request, Response, NextFunction } from 'express';
import * as basicAuth from 'express-basic-auth';

const basicAuthMiddleware = () =>
  basicAuth({
    challenge: true,
    users: { [process.env.DEVELOPER_USER]: process.env.DEVELOPER_PASS },
  });

export const devToolsBasicAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // access to web pages only happens with GET method
  if (req.method.toLowerCase() === 'get') {
    return basicAuthMiddleware()(req, res, next);
  }
  return next();
};
