import statusCodes from '../statusCodes';

export default class UnauthorizedError extends Error {
  public status: number;

  constructor(message: string) {
    super(message);
    this.status = statusCodes.unauthorized;
  }
}
