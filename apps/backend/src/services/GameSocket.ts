import axios from "axios";
import type { Server as HttpServer } from "http";
import type { Socket } from "socket.io";
import { Server as SocketServer } from "socket.io";

import type { NOTIFICATION_PAYLOAD } from "@acme/lib/WStypes/typeForFrontendToSocket";
import { AUTHENTICATION } from "@acme/lib/WStypes/typeForFrontendToSocket";

import { db } from "@acme/db";
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

    this.fillMatches().catch((err) => console.log(err));
  }
  
  private fillMatches = async () => {
    const matches = await db.match.findMany({
      where: {
        stats: { is: { winner: "PLAYING" } }
      },
      include: {
        moves: true,
        stats: true
      }
    })
    matches.forEach((match) => {
      this.matchRooms[match.id] = new MatchRoom(this.io, this.matchRooms, match.id, match as NOTIFICATION_PAYLOAD)
    })
    logger.info(`added ${matches.length} from DB`)
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
    socket.on("join_match", (matchId: string, ank: (mg: { data?: NOTIFICATION_PAYLOAD; error?: string }) => void) =>
      this.joinMatch(socket, matchId, ank),
    );
  };
  
  emitUpdate = (matchId: string, match?: NOTIFICATION_PAYLOAD) => {
    const matchRoom = this.matchRooms[matchId];
    if (matchRoom) {
      matchRoom.emitMatchUpdate(match).catch(() => {
        logger.error("Error emitting match update", { matchId }, "MatchRoom");
      });
    } else {
      logger.error("Match room not found", { matchId }, "MatchRoom");
    }
  };

  emitMatchCreated = (match: NOTIFICATION_PAYLOAD) => {
    this.matchRooms[match.id] = new MatchRoom(this.io, this.matchRooms, match.id, match)
    const [socketIdWhite, socketIdBlack] = [this.usersToSocketID[match.whitePlayerId], this.usersToSocketID[match.blackPlayerId]];
    if (socketIdWhite) this.io.to(socketIdWhite).emit("found_match", match.id);
    if (socketIdBlack) this.io.to(socketIdBlack).emit("found_match", match.id);
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
}
