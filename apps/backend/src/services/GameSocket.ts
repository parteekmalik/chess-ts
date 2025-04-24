import type { Server as HttpServer } from "http";
import type { Socket } from "socket.io";
import axios from "axios";
import { Chess } from "chess.js";
import { Server as SocketServer } from "socket.io";

import type { NOTIFICATION_PAYLOAD } from "@acme/lib/WStypes/typeForFrontendToSocket";
import { db } from "@acme/db";
import { AUTHENTICATION } from "@acme/lib/WStypes/typeForFrontendToSocket";

import { env } from "~/env";
import { MatchRoom } from "./gemeRoom";
import { logger } from "./Logger";

export interface UserDataType {
  id: string;
  name: string;
  email: string;
  emailVerified: string | null;
  image: string;
  rating: number;
}

interface SocketWithContextType extends Socket {
  data: {
    userData: UserDataType;
  };
}

export class GameSocket {
  public static instance: GameSocket;

  public io: SocketServer;

  private usersToSocketID: Record<string, string> = {};

  private matchRooms: Record<string, MatchRoom> = {};

  private waitingplayers: Record<string, { data: UserDataType; socketId: string }[]> = {};

  private playerCallbacks: Record<string, (msg: { data: NOTIFICATION_PAYLOAD }) => void> = {};

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
    if (env.NODE_ENV === "development") this.overrideRoomEmit();

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
    });

    this.io.on("connect", this.handleConnection);
  }

  private handleConnection = (socket: SocketWithContextType) => {
    if (socket.data.userData.id) {
      this.usersToSocketID[socket.data.userData.id] = socket.id;
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
    socket.on("find_match", (msg: { baseTime: number; incrementTime: number }, ank: (msg: { data: NOTIFICATION_PAYLOAD }) => void) =>
      this.handleFindMatch(socket, msg, ank),
    );
    socket.on("join_match", (matchId: string, ank: (mg: { data?: NOTIFICATION_PAYLOAD; error?: string }) => void) =>
      this.joinMatch(socket, matchId, ank),
    );
    socket.on("make_move_match", (props: { matchId: string; move: string }) => {
      const matchRoom = this.matchRooms[props.matchId];
      if (matchRoom) {
        matchRoom.handleRoomMessage(socket, "match_update", props.move);
      } else {
        logger.error("Match room not found", { matchId: props.matchId }, "MatchRoom");
      }
    });
  };

  private joinMatch = async (socket: SocketWithContextType, matchId: string, ank: (mg: { data?: NOTIFICATION_PAYLOAD; error?: string }) => void) => {
    const matchRoom = this.matchRooms[matchId];
    if (!matchRoom) {
      ank({ error: "404" });
    } else {
      await socket.join(matchId);

      const room = this.io.sockets.adapter.rooms.get(matchId);
      const userCount = room ? room.size : 0;
      ank({ data: matchRoom.match });
      this.io.to(matchId).emit("joined_match", { count: userCount, id: socket.data.userData.id });
    }
  };

  private handleFindMatch = async (
    socket: SocketWithContextType,
    msg: { baseTime: number; incrementTime: number },
    ank: (msg: { data: NOTIFICATION_PAYLOAD }) => void,
  ) => {
    const userid = socket.data.userData.id;
    const key = `${msg.baseTime}|${msg.incrementTime}`;
    const waitingPlayers = this.waitingplayers[key]?.filter((player) => player.data.id !== userid);

    if (waitingPlayers?.length && userid) {
      const compatiblePlayer = findBestMatch(waitingPlayers, socket.data.userData);

      const match = await db.match.create({
        data: {
          whitePlayerId: userid,
          blackPlayerId: compatiblePlayer.data.id,
          baseTime: msg.baseTime,
          incrementTime: msg.incrementTime,
          stats: {
            create: {},
          },
          users: {
            connect: [{ id: userid }, { id: compatiblePlayer.data.id }],
          },
        },
        include: {
          moves: true,
          stats: true,
        },
      });

      // Create new match room
      this.matchRooms[match.id] = new MatchRoom(match.whitePlayerId, match.blackPlayerId, new Chess(), this.io, { ...match, stats: match.stats! });

      this.playerCallbacks[match.blackPlayerId]!({ data: { ...match, stats: match.stats! } });
      ank({ data: { ...match, stats: match.stats! } });

      this.waitingplayers[key] = waitingPlayers.filter((player) => player.data.id !== match.whitePlayerId && player.data.id !== match.blackPlayerId);
    } else {
      this.playerCallbacks[userid] = ank;
      if (this.waitingplayers[key]) {
        this.waitingplayers[key].push({ data: socket.data.userData, socketId: socket.id });
      } else this.waitingplayers[key] = [{ data: socket.data.userData, socketId: socket.id }];
    }
  };
}

function findBestMatch(
  waitingPlayers: {
    data: UserDataType;
    socketId: string;
  }[],
  currentPlayer: UserDataType,
) {
  return waitingPlayers.sort((a, b) => Math.abs(a.data.rating - currentPlayer.rating) - Math.abs(b.data.rating - currentPlayer.rating))[0]!;
}
