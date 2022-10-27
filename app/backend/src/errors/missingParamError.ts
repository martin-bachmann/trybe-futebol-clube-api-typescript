import statusCodes from '../statusCodes';

export default class MissingParamError extends Error {
  public status: number;

  constructor(message: string) {
    super(message);
    this.status = statusCodes.badRequest;
  }
}
