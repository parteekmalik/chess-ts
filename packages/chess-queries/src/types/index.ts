// Chess-related types for queries and mutations

export interface ChessMatch {
  id: string;
  white?: string;
  black?: string;
  status: "waiting" | "active" | "finished";
  baseTimeSeconds: number;
  incrementSeconds: number;
  fen: string;
  moves: string[];
  createdAt: number;
  matchedAt?: number;
  finishedAt?: number;
}

export interface ChessProfile {
  id: string;
  wallet: string;
  rating: number;
  wins: number;
  losses: number;
  draws: number;
  displayName: string;
  matches: string[];
}

export interface CreateChessMatchParams {
  matchId: number;
  baseTimeSeconds: number;
  incrementSeconds: number;
}

export interface JoinChessMatchParams {
  chessMatch: string;
  profile: string;
}

export interface MakeMoveParams {
  chessMatch: string;
  profile: string;
  move: string;
}

export interface CloseChessMatchParams {
  chessMatch: string;
}

export interface ChessQueryKeys {
  program: readonly ["chess", "program"];
  accounts: readonly ["chess", "accounts", { cluster: string }];
  profile: readonly ["chess", "profile", string];
  match: readonly ["chess", "match", string];
  matches: readonly ["chess", "matches", { cluster: string }];
}
