import { Request, Response } from 'express';
import statusCodes from '../statusCodes';
import LeaderboardService from '../services/LeaderboardService';

export default class LeaderboardController {
  constructor(private leaderboardService = new LeaderboardService()) { }

  getHomeLeaderboard = async (req: Request, res: Response) => {
    const leaderboard = await this.leaderboardService.getHomeLeaderboard();

    return res.status(statusCodes.ok).json(leaderboard);
  };
}
