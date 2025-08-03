import type { MatchWinner } from "@acme/db";
import { db } from "@acme/db";
import type { makeMoveInput } from "@acme/lib/live";
import { calculateTimeLeft, makeMove } from "@acme/lib/live";
import type { NOTIFICATION_PAYLOAD } from "@acme/lib/WStypes/typeForFrontendToSocket";
import type { Socket, Server as SocketServer } from "socket.io";
import type { UserDataType } from "./GameSocket";
import { logger } from "./Logger";
interface SocketWithContextType extends Socket {
  data: {
    userData: UserDataType;
  };
}

export class MatchRoom {
  private io: SocketServer;
  private finishMatchTimeout?: NodeJS.Timeout;
  private matchRooms: Record<string, MatchRoom>
  public match?: NOTIFICATION_PAYLOAD;
  public matchId: string;

  constructor(io: SocketServer, matchRooms: Record<string, MatchRoom>, matchId: string, match?: NOTIFICATION_PAYLOAD) {
    this.io = io;
    this.matchId = matchId;
    this.matchRooms = matchRooms;
    this.match = match;
    this.addTimer();
    this.refreshAndGetMatch().catch((error) => console.error("Error refreshing match:", error));
  }

  private destroy() {
    delete this.matchRooms[this.matchId];
  }

  private addTimer() {
    const data = this.calulateTimeToFinish();
    if (!data) return;

    const { reason, timeLeft, winner } = data;
    if( this.finishMatchTimeout) {
      clearTimeout(this.finishMatchTimeout);
      this.finishMatchTimeout = undefined;
    }
    this.finishMatchTimeout = setTimeout(() => {
      db.matchResult.update({
        where: {
          id: this.match?.stats.id
        },
        data: {
          winner,
          reason
        }
      })
        .then(async () => {
          await this.emitMatchUpdate();
          this.destroy()
        })
        .catch((err) => console.log(err))
    }, timeLeft)
  }

  private async refreshAndGetMatch() {
    const match = await db.match
      .findUnique({
        where: {
          id: this.matchId,
        },
        include: {
          moves: true,
          stats: true,
        },
      })
      .then((data) => {
        if (data) {
          this.match = { ...data, stats: data.stats! };
        }
        return this.match;
      })
    return match;
  }

  async emitMatchUpdate(match?: NOTIFICATION_PAYLOAD) {
    if (!match) await this.refreshAndGetMatch();
    else this.match = match;
    this.io.to(this.match!.id).emit("match_update", this.match);
    if (this.match?.stats.winner === "PLAYING") this.addTimer();
  }

  async makeMove(inputs: makeMoveInput) {
    try {
      const move = await makeMove(db, inputs);
      await this.emitMatchUpdate(move as NOTIFICATION_PAYLOAD);
    } catch (error) {
      logger.error("Error making move", { error });
    }
  }

  private calulateTimeToFinish() {
    if (!this.match) return null;
    const times = calculateTimeLeft(
      { baseTime: this.match.baseTime, incrementTime: this.match.incrementTime },
      [this.match.startedAt].concat(this.match.moves.map((move) => move.timestamps)),
    )
    const turn = this.match.moves.length % 2 ? "b" : "w";
    const winner: MatchWinner = turn === 'w' ? 'BLACK' : 'WHITE';
    return { timeLeft: times[turn], winner, reason: 'timeout' };
  }
  public handleRoomMessage(socket: SocketWithContextType, type: string, payload: unknown) {
    switch (type) {
      case "default": {
        logger.info("default", { type, payload });
        break;
      }
    }
  }
}
