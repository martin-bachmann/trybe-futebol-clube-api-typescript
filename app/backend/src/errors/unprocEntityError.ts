import statusCodes from '../statusCodes';

export default class UnprocEntityError extends Error {
  public status: number;

  constructor(message: string) {
    super(message);
    this.status = statusCodes.unprocessableEntity;
  }
}
