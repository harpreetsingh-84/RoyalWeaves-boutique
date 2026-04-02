import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest<
  P = import('express-serve-static-core').ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = import('qs').ParsedQs,
  Locals extends Record<string, any> = Record<string, any>
> extends Request<P, ResBody, ReqBody, ReqQuery, Locals> {
  user?: any;
}

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction): void | Response<any, Record<string, any>> => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized, no token provided' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized, invalid token' });
  }
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction): void | Response<any, Record<string, any>> => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    return res.status(403).json({ message: 'Forbidden. Admin access required.' });
  }
};
