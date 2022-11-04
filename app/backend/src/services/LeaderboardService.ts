import LeaderboardRow from '../LeaderboardRow';
import Leaderboard from '../Leaderboard';
import MatchService from './MatchService';
import TeamService from './TeamService';

export default class LeaderboardService {
  constructor(private teamService = new TeamService(), private matchService = new MatchService()) {}

  getHomeLeaderboard = async (): Promise<LeaderboardRow[]> => {
    const teams = await this.teamService.getAllTeams();
    const matches = await this.matchService.getAllMatches();

    const leaderboard = new Leaderboard(teams, matches);
    return leaderboard.create();
  };
}
