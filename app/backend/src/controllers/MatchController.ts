import { Request, Response } from 'express';
import statusCodes from '../statusCodes';
import MatchService from '../services/MatchService';

export default class MatchController {
  constructor(private matchService = new MatchService()) { }

  getAllMatches = async (_req: Request, res: Response) => {
    const matches = await this.matchService.getAllMatches();
    return res.status(statusCodes.ok).json(matches);
  };
}
