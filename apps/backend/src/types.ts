import type { Chess } from "chess.js";

export type SocketUserMap = Record<string, string>;

export type SocketUserMatchMap = Record<
  string,
  {
    userid: string;
    matchid: string;
  }
>;

export interface GameStats {
  isover: boolean;
  reason: string;
  winner: string;
}

export interface GameState {
  players: Record<string, string>;
  game: Chess;
  time: Date[];
  startedAt: Date;
  stats: GameStats;
}

export type Games = Record<string, GameState>;
