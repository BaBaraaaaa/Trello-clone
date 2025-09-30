import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload { userId: string }
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
if (!ACCESS_TOKEN_SECRET) {
  throw new Error('ACCESS_TOKEN_SECRET is not defined in environment variables');
}
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;
if (!REFRESH_TOKEN_SECRET) {
  throw new Error('REFRESH_TOKEN_SECRET is not defined in environment variables');
}
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, ACCESS_TOKEN_SECRET) as JwtPayload;
    (req as any).userId = payload.userId;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
