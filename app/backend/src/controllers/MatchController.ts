import { Request, Response } from 'express';
import statusCodes from '../statusCodes';
import MatchService from '../services/MatchService';

export default class MatchController {
  constructor(private matchService = new MatchService()) { }

  getAllMatches = async (req: Request, res: Response) => {
    const { inProgress } = req.query;

    let matches;

    if (inProgress) {
      matches = await this.matchService.getMatchesInProgress();
    } else {
      matches = await this.matchService.getAllMatches();
    }

    return res.status(statusCodes.ok).json(matches);
  };
}
