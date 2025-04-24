import type { Chess, Color } from "chess.js";
import type { Socket, Server as SocketServer } from "socket.io";
import moment from "moment";

import type { Prisma } from "@acme/db";
import type { NOTIFICATION_PAYLOAD } from "@acme/lib/WStypes/typeForFrontendToSocket";
import { db } from "@acme/db";

import type { UserDataType } from "./GameSocket";
import { logger } from "./Logger";

interface SocketWithContextType extends Socket {
  data: {
    userData: UserDataType;
  };
}

export class MatchRoom {
  private players: Record<string, string>;

  private game: Chess; // chess.js game instance

  private io: SocketServer;

  public match: NOTIFICATION_PAYLOAD;

  constructor(whitePlayer: string, blackPlayer: string, game: Chess, io: SocketServer, match: NOTIFICATION_PAYLOAD) {
    this.players = {
      w: whitePlayer,
      b: blackPlayer,
    };
    this.game = game;
    this.io = io;
    this.match = match;
  }

  public oppositeTurn(turn: Color): Color {
    return turn === "w" ? "b" : "w";
  }

  private isPlayersTurn(userId: string): boolean {
    return this.players[this.game.turn()] === userId;
  }

  private refreshMatch() {
    db.match
      .findUnique({
        where: {
          id: this.match.id,
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
      })
      .catch((error) => console.log(error));
  }

  private async handleMove(socket: SocketWithContextType, move: string) {
    try {
      this.game.move(move);
      const matchId = this.match.id;

      this.match.moves.push({
        matchId,
        move,
        timestamps: moment().toDate(),
        id: "",
      });

      this.updateGameStatus();
      this.io.to(matchId).emit("match_update", this.match);

      await db.move.create({
        data: {
          move,
          matchId,
        },
      });
      this.refreshMatch();
    } catch {
      socket.emit("error", "Invalid move");
    }
  }

  private updateGameStatus() {
    if (!this.game.isGameOver()) return;
    const data = {
      winner: this.game.isDraw() ? "DRAW" : this.oppositeTurn(this.game.turn()) === "w" ? "WHITE" : "BLACK",
      reason: this.game.isDraw() ? "repetition" : "checkmate",
    } satisfies Prisma.MatchResultUpdateArgs["data"];
    db.matchResult
      .update({
        where: {
          matchId: this.match.id,
        },
        data: {
          winner: data.winner,
          reason: data.reason,
        },
      })
      .catch((error) => console.log(error))
      .finally(() => this.refreshMatch());
    this.match.stats = { ...this.match.stats, ...data };
  }

  public handleRoomMessage(socket: SocketWithContextType, type: string, payload: unknown) {
    const authMap: Record<string, string> = {
      match_update: "playerTurn",
    };

    const isPlayerTurn = this.isPlayersTurn(socket.data.userData.id);

    if (!isPlayerTurn && authMap[type] === "playerTurn") {
      socket.emit("dockt", { message: "Unauthorized access not your turn. type:" + type });
    } else {
      switch (type) {
        case "match_update": {
          if (isPlayerTurn) this.handleMove(socket, payload as string).catch((error) => logger.error("handleMove", error));
          break;
        }
        case "default": {
          logger.info("default", { type, payload });
          break;
        }
      }
    }
  }
}
