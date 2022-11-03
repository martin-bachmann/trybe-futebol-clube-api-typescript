import { sign, verify } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import 'dotenv/config';
import UnauthorizedError from '../errors/unauthorized-error';

const secret: string = process.env.JWT_SECRET || 'seusecretdetoken';

const generateToken = (id: number, email: string): string => {
  const payload = { id, email };
  const token = sign(payload, secret);
  return token;
};

const validateJWT = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization');
  if (!token) {
    throw new UnauthorizedError('Token not found');
  }

  try {
    const decoded = await verify(token, secret);
    req.body = { ...req.body, user: decoded };
    next();
  } catch (err) {
    throw new UnauthorizedError('Token must be a valid token');
  }
};

export { generateToken, validateJWT };
