import { Request, Response } from 'express';
import statusCodes from '../statusCodes';
import TeamService from '../services/TeamService';

export default class TeamController {
  constructor(private teamService = new TeamService()) { }

  getAllTeams = async (_req: Request, res: Response) => {
    const teams = await this.teamService.getAllTeams();
    return res.status(statusCodes.ok).json(teams);
  };

  getTeamById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const team = await this.teamService.getTeamById(Number(id));
    return res.status(statusCodes.ok).json(team);
  };
}
