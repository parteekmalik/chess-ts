import { Chess } from "chess.js";
import moment from "moment";
import { z } from "zod";

import type { MatchWinner, PrismaClient } from "@acme/db/client";

export const gameTypes = {
  bullet: [
    { baseTime: 1, incrementTime: 0 },
    { baseTime: 1, incrementTime: 1 },
    { baseTime: 2, incrementTime: 1 },
  ],
  blitz: [
    { baseTime: 3, incrementTime: 0 },
    { baseTime: 3, incrementTime: 2 },
    { baseTime: 5, incrementTime: 0 },
  ],
  rapid: [
    { baseTime: 10, incrementTime: 0 },
    { baseTime: 15, incrementTime: 10 },
    { baseTime: 30, incrementTime: 0 },
  ],
  daily: [
    { baseTime: 1 * 24 * 60, incrementTime: 0 },
    { baseTime: 3 * 24 * 60, incrementTime: 0 },
    { baseTime: 7 * 24 * 60, incrementTime: 0 },
  ],
};

// make sure to provie staring time on first moveTimes
export function calculateTimeLeft(config: { baseTime: number; incrementTime: number }, movesTimes: Date[]) {
  const movesTime = movesTimes.map((move) => moment(move).valueOf());

  let timeLeftw = config.baseTime;
  let timeLeftb = config.baseTime;
  for (let i = 1; i < movesTime.length; i += 2) {
    timeLeftw -= movesTime[i]! - movesTime[i - 1]!;
    // timeLeft += this.config.incrementTime;
  }
  for (let i = 2; i < movesTime.length; i += 2) {
    timeLeftb -= movesTime[i]! - movesTime[i - 1]!;
    // timeLeft += this.config.incrementTime;
  }
  const timeDetected = moment().valueOf() - movesTime[movesTime.length - 1]!;
  const isWhiteTurn = movesTimes.length % 2 === 1;
  const data = { w: isWhiteTurn ? timeLeftw - timeDetected : timeLeftw, b: isWhiteTurn ? timeLeftb : timeLeftb - timeDetected };
  return data;
}

export function getLastElement<T>(arr: T[]): T {
  return arr[arr.length - 1]!;
}

export const MoveSchema = z.union([
  z.string().min(2),
  z.object({ from: z.string().min(1), to: z.string().min(1), promotion: z.string().optional() }),
]);
export type ChessMoveType = z.infer<typeof MoveSchema>;

export const findMatchSchema = z.object({
  baseTime: z.number().min(1),
  incrementTime: z.number().min(0),
});

export interface findMatchInput {
  input: z.infer<typeof findMatchSchema>;
  userId?: string;
  db: PrismaClient;
}
async function expireWating(db: PrismaClient) {
  await db.watingPlayer.deleteMany({
    where: {
      expiry: {
        lt: new Date(),
      },
    },
  });
}
export async function findMatch({ db, input, userId }: findMatchInput) {
  await expireWating(db);
  const toFillSlot = await db.watingPlayer.findFirst({
    where: {
      NOT: {
        id: userId,
      },
    },
  });
  const isWaiting = await db.watingPlayer.findFirst({ where: { userId } });
  if (isWaiting || !userId) throw new Error("You are already waiting for a match or not logged in");
  if (toFillSlot) {
    const match = await db.match.create({
      data: {
        baseTime: input.baseTime,
        incrementTime: input.incrementTime,
        whitePlayerId: toFillSlot.userId,
        blackPlayerId: userId,
        startedAt: moment().toDate(),
        stats: {
          create: {},
        },
      },
      include: {
        moves: true,
        stats: true,
      },
    });
    await db.watingPlayer.delete({
      where: {
        id: toFillSlot.id,
      },
    });
    return match;
  } else if (userId) {
    await db.watingPlayer.create({
      data: {
        baseTime: input.baseTime,
        incrementTime: input.incrementTime,
        userId,
        expiry: moment().add(5, "minutes").toDate(),
      },
    });
  }
}
export interface makeMoveInput {
  userId: string;
  matchId: string;
  move: ChessMoveType;
}
export async function makeMove(db: PrismaClient, input: makeMoveInput) {
  let match = await db.match.findUnique({
    where: {
      id: input.matchId,
    },
    include: {
      moves: true,
      stats: true,
    },
  });
  if (!match) throw new Error("Match not found");
  if (match.stats?.winner !== "PLAYING") throw new Error("Math is already over");
  const game = new Chess();
  match.moves.forEach((move) => game.move(move.move));

  if ((game.turn() === "w" ? match.whitePlayerId : match.blackPlayerId) !== input.userId) {
    throw new Error("You cannot make a move on your opponent's turn");
  }
  try {
    game.move(input.move);
  } catch {
    throw new Error("Invalid move");
  }
  const move = game.history().slice(-1)[0]!;

  match.moves.push({
    matchId: input.matchId,
    move,
    timestamp: moment().toDate(),
    id: "",
  });

  const winner: MatchWinner = game.isDraw() ? "DRAW" : game.turn() === "w" ? "BLACK" : "WHITE";
  const reason = game.isDraw() ? "repetition" : "checkmate";

  match = await db.match.update({
    where: {
      id: input.matchId,
    },
    data: {
      moves: {
        create: {
          move,
        },
      },
      stats: game.isGameOver()
        ? {
            upsert: {
              create: { winner, reason },
              update: { winner, reason },
            },
          }
        : undefined,
    },
    include: {
      moves: true,
      stats: true,
    },
  });
  return match;
}
