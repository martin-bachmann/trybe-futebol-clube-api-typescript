import statusCodes from '../statusCodes';

export default class NotFoundError extends Error {
  public status: number;

  constructor(message: string) {
    super(message);
    this.status = statusCodes.notFound;
  }
}
