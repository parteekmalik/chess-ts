import type { Server as HttpServer } from "http";
import type { Socket } from "socket.io";
import axios from "axios";
import { Chess } from "chess.js";
import { Server as SocketServer } from "socket.io";

import type { ChessMoveType } from "@acme/lib/puzzle";
import { AUTHENTICATION } from "@acme/lib/WStypes/typeForFrontendToSocket";

import type { SocketUserMap } from "../types";
import { env } from "~/env";
import { prisma } from "../Utils";
import { MatchRoom } from "./gemeRoom";
import { logger } from "./Logger";

export interface UserDataType {
  id: string;
  name: string;
  email: string;
  emailVerified: string | null;
  image: string;
  spotTradingAccountId: string;
  marginTradingAccountId: string;
}

interface SocketWithContextType extends Socket {
  data: {
    userData: UserDataType;
  };
}

export class GameSocket {
  public static instance: GameSocket;

  public io: SocketServer;

  private usersToSocketID: SocketUserMap = {};

  private matchRooms: Record<string, MatchRoom> = {};

  private waitingplayers: { id: string; socketId: string }[] = [];

  private playerCallbacks: Record<string, (data: unknown) => void> = {};

  private overrideRoomEmit() {
    const originalTo = this.io.to.bind(this.io);

    this.io.to = (room: string) => {
      const roomNamespace = originalTo(room);

      const originalRoomEmit = roomNamespace.emit.bind(roomNamespace);

      roomNamespace.emit = (event: string, ...args: unknown[]) => {
        logger.info(`Server emitted to room "${room}": Event "${event}"`, args, "Room");
        return originalRoomEmit(event, ...args);
      };

      return roomNamespace;
    };
  }

  constructor(server: HttpServer) {
    GameSocket.instance = this;
    this.io = new SocketServer(server, {
      cors: {
        methods: ["GET", "POST"],
        origin: [env.AUTH_URL, "https://yourdomain.com", "http://localhost:3000"],
      },
      pingInterval: 1000,
      pingTimeout: 5000,
    });

    // Override `to(room).emit` for room-specific logging
    if(env.NODE_ENV === "development")  this.overrideRoomEmit();

    this.io.use((socket: SocketWithContextType, next) => {
      axios
        .get(`${process.env.AUTH_URL}/api/auth/session`, {
          headers: {
            Cookie: `${env.NODE_ENV === "production" ? "__Secure-" : ""}authjs.session-token=${socket.handshake.auth.token};`,
          },
        })
        .then((response) => {
          const data = (response.data as { user: UserDataType | undefined }).user;
          if (!data) {
            throw new Error(`Not Authenticated: ${socket.handshake.auth.token}`);
          }

          socket.data.userData = data;
          next();
        })
        .catch((error) => {
          console.error("Authentication error:", (error as Error).message);
          socket.disconnect(true);
        });
      // try {
      //   const userId = socket.handshake.auth?.userId as string | undefined;

      //   if (!userId) {
      //     const guestId = `guest_${this.guestUsers.length + 1}`;
      //     socket.userid = guestId;
      //     this.guestUsers.push({ id: guestId, username: `Guest ${this.guestUsers.length + 1}` });

      //     this.useridToSocket[guestId] = socket.id;

      //     socket.emit("guest_id_assigned", guestId);
      //   } else {
      //     this.useridToSocket[userId] = socket.id;
      //     socket.userid = userId;

      //     socket.emit("guest_id_assigned", userId);
      //   }
      //   next();
      // } catch (error) {
      //   socket.disconnect(true);
      // }
    });

    this.io.on("connect", this.handleConnection);
  }

  private handleConnection = (socket: SocketWithContextType) => {
    if (socket.data.userData.id) {
      this.usersToSocketID[socket.data.userData.id] = socket.id;
      // this.usersToSocketID[socket.data.userData.id] = {
      //   id: socket.id,
      //   data: socket.data.userData,
      // };
      socket.emit(AUTHENTICATION, "sucessful");

      logger.info(`User connected: ${socket.id} with userid: ${socket.data.userData.id}`);
    } else {
      socket.disconnect(true);
    }

    if (env.NODE_ENV === "development") {
      socket.onAny((event, ...args) => {
        logger.info(`Received event: "${event}" to ${socket.id} with data:`, args);
      });

      socket.onAnyOutgoing((event, ...args) => {
        logger.info(`Sending event: "${event}" to ${socket.id} with data:`, args);
      });
    }

    socket.on("disconnect", () => delete this.usersToSocketID[socket.data.userData.id]);
    socket.on("find_match", (msg: { baseTime: number; incrementTime: number }, ank: (msg: unknown) => void) =>
      this.handleFindMatch(socket, msg, ank),
    );
    socket.on("join_match", (matchId: string, ank: (mg: { data?: matchDetails; error?: string }) => void) => this.joinMatch(socket, matchId, ank));
    socket.on("make_move_match", (props: { matchId: string; move: string }) => {
      const matchRoom = this.matchRooms[props.matchId];
      if (matchRoom) {
        matchRoom.handleRoomMessage(socket, "match_update", props.move);
      } else {
        logger.error("Match room not found", { matchId: props.matchId }, "MatchRoom");
      }
    });
  };

  private joinMatch = async (socket: SocketWithContextType, matchId: string, ank: (mg: { data?: matchDetails; error?: string }) => void) => {
    const matchRoom = this.matchRooms[matchId];
    if (!matchRoom) {
      ank({ error: "404" });
    } else {
      await socket.join(matchId);

      const room = this.io.sockets.adapter.rooms.get(matchId);
      const userCount = room ? room.size : 0;
      ank({ data: matchRoom.getGameState() });
      this.io.to(matchId).emit("joined_match", { count: userCount, id: socket.data.userData.id });
    }
  };

  private handleFindMatch = async (socket: SocketWithContextType, msg: { baseTime: number; incrementTime: number }, ank: (msg: unknown) => void) => {
    const userid = socket.data.userData.id;

    const waitingPlayersArray = this.waitingplayers;

    // Only proceed if there's a waiting player
    const compatiblePlayer = waitingPlayersArray[0];

    if (!waitingPlayersArray.some((player) => player.id === userid) && compatiblePlayer && userid) {
      const match = await prisma.match.create({
        data: {
          whitePlayerId: userid,
          blackPlayerId: compatiblePlayer.id,
          baseTime: msg.baseTime,
          incrementTime: msg.incrementTime,
          users: {
            connect: [{ id: userid }, { id: compatiblePlayer.id }],
          },
        },
      });

      // Create new match room
      this.matchRooms[match.id] = new MatchRoom(match.whitePlayerId, match.blackPlayerId, new Chess(), this.io, match.id, match.startedAt, {
        baseTime: msg.baseTime,
        incrementTime: msg.incrementTime,
      });

      const data = { matchId: match.id };
      this.playerCallbacks[match.blackPlayerId]!({ data });
      ank({ data });

      this.waitingplayers = this.waitingplayers.filter((player) => player.id !== match.whitePlayerId && player.id !== match.blackPlayerId);
    } else {
      this.playerCallbacks[userid] = ank;
      this.waitingplayers.push({ id: userid, socketId: socket.id });
    }
  };
}
interface matchDetails {
  matchId: string;
  moves: ChessMoveType[];
  players: { w: { id: string; timeLeft: number }; b: { id: string; timeLeft: number } };
  config: { baseTime: number; incrementTime: number };
}
