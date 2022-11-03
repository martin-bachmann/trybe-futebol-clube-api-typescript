import { Request, Response } from 'express';
import statusCodes from '../statusCodes';
import MatchService from '../services/MatchService';

export default class MatchController {
  constructor(private matchService = new MatchService()) { }

  getAllMatches = async (req: Request, res: Response) => {
    const { inProgress } = req.query;

    let matches;

    if (inProgress) {
      matches = await this.matchService.getMatchesByProgress(inProgress === 'true');
    } else {
      matches = await this.matchService.getAllMatches();
    }

    return res.status(statusCodes.ok).json(matches);
  };

  createMatch = async (req: Request, res: Response) => {
    const { homeTeam, awayTeam, homeTeamGoals, awayTeamGoals } = req.body;

    const match = await this.matchService
      .createMatch(homeTeam, awayTeam, homeTeamGoals, awayTeamGoals);

    return res.status(statusCodes.created).json(match);
  };

  updateMatchProgress = async (req: Request, res: Response) => {
    const { id } = req.params;

    await this.matchService.updateMatchProgress(Number(id));

    return res.status(statusCodes.ok).json({ message: 'Finished' });
  };

  updateMatchScore = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { homeTeamGoals, awayTeamGoals } = req.body;

    await this.matchService.updateMatchScore(id, homeTeamGoals, awayTeamGoals);

    return res.status(statusCodes.ok).json({ message: 'Ok' });
  };
}
