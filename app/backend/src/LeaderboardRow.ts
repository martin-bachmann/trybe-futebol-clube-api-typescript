import Match from './database/models/MatchModel';
import Team from './database/models/TeamModel';

export default class LeaderboardRow {
  id: number;
  name: string;
  totalPoints: number;
  totalGames: number;
  totalVictories: number;
  totalDraws: number;
  totalLosses: number;
  goalsFavor: number;
  goalsOwn: number;
  goalsBalance: number;
  efficiency: number;

  constructor(team: Team) {
    this.id = team.id;
    this.name = team.teamName;
    this.totalPoints = 0;
    this.totalGames = 0;
    this.totalVictories = 0;
    this.totalDraws = 0;
    this.totalLosses = 0;
    this.goalsFavor = 0;
    this.goalsOwn = 0;
    this.goalsBalance = 0;
    this.efficiency = 0;
  }

  update = (match: Match): void => {
    const { homeTeamGoals, awayTeamGoals } = match;
    this.totalGames += 1;
    this.goalsFavor += homeTeamGoals;
    this.goalsOwn += awayTeamGoals;
    this.goalsBalance = this.calculateGoalsBalance();
    if (homeTeamGoals > awayTeamGoals) {
      this.totalVictories += 1;
      this.totalPoints += 3;
    } else if (homeTeamGoals === awayTeamGoals) {
      this.totalDraws += 1;
      this.totalPoints += 1;
    } else {
      this.totalLosses += 1;
    }
    this.efficiency = this.calculateEfficiency();
  };

  calculateGoalsBalance = (): number => this.goalsFavor - this.goalsOwn;

  calculateEfficiency = (): number => {
    const eff = (this.totalPoints / (this.totalGames * 3)) * 100;
    return Number(eff.toFixed(2));
  };
}
