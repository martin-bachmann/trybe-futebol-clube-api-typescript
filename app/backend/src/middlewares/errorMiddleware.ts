import { ErrorRequestHandler } from 'express';
import statusCodes from '../statusCodes';

const errorMiddleware: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err.status) {
    return res.status(err.status).json({ message: err.message });
  }

  return res.status(statusCodes.internalServerError).json({ message: err.message });
};

export default errorMiddleware;
