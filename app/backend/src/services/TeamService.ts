import NotFoundError from '../errors/notFoundError';
import Team from '../database/models/TeamModel';

export default class TeamService {
  constructor(private model = Team) { }

  getAllTeams = async (): Promise<Team[]> => {
    const teams = await this.model.findAll();
    return teams;
  };

  getTeamById = async (id: number): Promise<Team> => {
    const team = await this.model.findByPk(id);

    if (!team) {
      throw new NotFoundError('Team does not exist');
    }

    return team;
  };
}
