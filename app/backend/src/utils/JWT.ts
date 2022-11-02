import { JwtPayload, sign, verify } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import 'dotenv/config';
import statusCodes from '../statusCodes';

const secret: string = process.env.JWT_SECRET || 'seusecretdetoken';

const generateToken = (id: number, email: string): string => {
  const payload = { id, email };
  const token = sign(payload, secret);
  return token;
};

const validateJWT = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(statusCodes.unauthorized).json({ message: 'Token not found' });
  }

  try {
    const decoded = await verify(token, secret);
    req.body.user = decoded as JwtPayload;
    next();
  } catch (err) {
    return res.status(statusCodes.unauthorized).json({ message: 'Token must be a valid token' });
  }
};

export { generateToken, validateJWT };
