import { Chess } from 'chess.js';

export interface SocketUserMap {
  [key: string]: string;
}

export interface SocketUserMatchMap {
  [key: string]: {
    userid: string;
    matchid: string;
  };
}

export interface GameStats {
  isover: boolean;
  reason: string;
  winner: string;
}

export interface GameState {
  players: { [key: string]: string };
  game: Chess;
  time: Date[];
  startedAt: Date;
  stats: GameStats;
}

export interface Games {
  [key: string]: GameState;
} 