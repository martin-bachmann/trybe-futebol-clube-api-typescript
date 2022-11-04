import Match from './database/models/MatchModel';
import Team from './database/models/TeamModel';
import LeaderboardRow from './LeaderboardRow';

export default class Leaderboard {
  private teams: Team[];
  private matches: Match[];

  constructor(teams: Team[], matches: Match[]) {
    this.teams = teams;
    this.matches = matches;
  }

  create = (place?: string): LeaderboardRow[] => {
    const leaderboard = this.teams.map((team) => new LeaderboardRow(team));

    const updatedLeaderboard = this.update(leaderboard, place);

    const sortedLeaderboard = this.sort(updatedLeaderboard);

    return sortedLeaderboard;
  };

  update = (leaderboard: LeaderboardRow[], place?: string): LeaderboardRow[] => {
    this.matches.forEach((match) => {
      if (!match.inProgress) {
        if (place !== 'away') {
          const teamIndex = leaderboard.findIndex((team) => (team.id === match.homeTeam));
          leaderboard[teamIndex].update(match, true);
        }
        if (place !== 'home') {
          const teamIndex = leaderboard.findIndex((team) => (team.id === match.awayTeam));
          leaderboard[teamIndex].update(match, false);
        }
      }
    });

    return leaderboard;
  };

  sort = (leaderboard: LeaderboardRow[]): LeaderboardRow[] => {
    leaderboard.sort((a, b) => {
      let verify = b.totalPoints - a.totalPoints;
      if (verify === 0) verify = b.totalVictories - a.totalVictories;
      if (verify === 0) verify = b.goalsBalance - a.goalsBalance;
      if (verify === 0) verify = b.goalsFavor - a.goalsFavor;
      if (verify === 0) verify = b.goalsOwn - a.goalsOwn;
      return verify;
    });
    return leaderboard;
  };
}
