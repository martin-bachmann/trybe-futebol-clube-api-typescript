import Team from '../database/models/TeamModel';
import Match from '../database/models/MatchModel';
import UnprocEntityError from '../errors/unprocEntityError';
import TeamService from './TeamService';

export default class MatchService {
  constructor(private model = Match, private teamService = new TeamService()) { }

  getAllMatches = async (): Promise<Match[]> => {
    const matches = await this.model.findAll({
      include: [
        { model: Team, as: 'teamHome', attributes: { exclude: ['id'] } },
        { model: Team, as: 'teamAway', attributes: { exclude: ['id'] } },
      ],
    });

    return matches;
  };

  getMatchesByProgress = async (inProgress: boolean): Promise<Match[]> => {
    const matches = await this.model.findAll({
      where: { inProgress },
      include: [
        { model: Team, as: 'teamHome', attributes: { exclude: ['id'] } },
        { model: Team, as: 'teamAway', attributes: { exclude: ['id'] } },
      ],
    });

    return matches;
  };

  createMatch = async (
    homeTeam: number,
    awayTeam: number,
    homeTeamGoals: number,
    awayTeamGoals: number,
  ): Promise<Match> => {
    if (homeTeam === awayTeam) {
      throw new UnprocEntityError('It is not possible to create a match with two equal teams');
    }

    await this.teamService.getTeamById(homeTeam);
    await this.teamService.getTeamById(awayTeam);

    const newMatch = await this.model
      .create({ homeTeam, awayTeam, homeTeamGoals, awayTeamGoals, inProgress: true });

    return newMatch;
  };

  updateMatchProgress = async (id: number): Promise<void> => {
    await this.model.update(
      { inProgress: false },
      { where: { id } },
    );
  };

  updateMatchScore = async (
    id: string,
    homeTeamGoals: string,
    awayTeamGoals: string,
  ): Promise<void> => {
    await this.model.update(
      { homeTeamGoals, awayTeamGoals },
      { where: { id } },
    );
  };
}
