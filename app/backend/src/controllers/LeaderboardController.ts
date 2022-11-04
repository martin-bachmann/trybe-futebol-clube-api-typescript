import { Request, Response } from 'express';
import statusCodes from '../statusCodes';
import LeaderboardService from '../services/LeaderboardService';

export default class LeaderboardController {
  constructor(private leaderboardService = new LeaderboardService()) { }

  getFullLeaderboard = async (_req: Request, res: Response) => {
    const leaderboard = await this.leaderboardService.getLeaderboard();

    return res.status(statusCodes.ok).json(leaderboard);
  };

  getHomeLeaderboard = async (_req: Request, res: Response) => {
    const leaderboard = await this.leaderboardService.getLeaderboard('home');

    return res.status(statusCodes.ok).json(leaderboard);
  };

  getAwayLeaderboard = async (_req: Request, res: Response) => {
    const leaderboard = await this.leaderboardService.getLeaderboard('away');

    return res.status(statusCodes.ok).json(leaderboard);
  };
}
