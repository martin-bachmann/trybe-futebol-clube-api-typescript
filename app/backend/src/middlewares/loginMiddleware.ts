import { NextFunction, Request, Response } from 'express';
import * as Joi from 'joi';
import MissingParamError from '../errors/missingParamError';

const loginSchema = Joi.object({
  email: Joi.string().required().messages({
    'string.empty': '"username" is required',
  }),
  password: Joi.string().required().messages({
    'string.empty': '"password" is required',
  }),
});

const loginMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const validation = loginSchema.validate(req.body);
  if (validation.error) {
    throw new MissingParamError('All fields must be filled');
  }
  next();
};

export default loginMiddleware;
