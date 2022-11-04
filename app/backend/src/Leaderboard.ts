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

  create = (): LeaderboardRow[] => {
    const leaderboard = this.teams.map((team) => new LeaderboardRow(team));
    console.log(this.matches);
    this.matches.forEach((match) => {
      const teamIndex = leaderboard.findIndex((team) => (team.id === match.homeTeam));
      leaderboard[teamIndex].update(match);
    });

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
