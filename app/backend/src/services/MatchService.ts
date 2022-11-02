import Team from '../database/models/TeamModel';
import Match from '../database/models/MatchModel';

export default class MatchService {
  constructor(private model = Match) { }

  getAllMatches = async (): Promise<Match[]> => {
    const matches = await this.model.findAll({
      include: [
        { model: Team, as: 'teamHome', attributes: { exclude: ['id'] } },
        { model: Team, as: 'teamAway', attributes: { exclude: ['id'] } },
      ],
    });
    console.log(matches);
    return matches;
  };
}
