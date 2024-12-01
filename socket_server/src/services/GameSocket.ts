import { Chess } from 'chess.js';
import { Server as HttpServer } from 'http';
import { Socket, Server as SocketServer } from 'socket.io';
import { SocketUserMap } from '../types';
import { prisma } from '../Utils';
import { Logger } from './Logger';
import { MatchRoom } from './gemeRoom';
import moment from 'moment';

interface GuestUser {
  id: string;
  username: string;
}

interface SocketWithUserID extends Socket {
  userid?: string;
}

export class GameSocket {
  public static instance: GameSocket;

  public io: SocketServer;

  private useridToSocket: SocketUserMap = {};

  private matchRooms: { [matchId: string]: MatchRoom } = {};

  private waitingplayers: {
    guestPlayers: { id: string; socketId: string }[];
    registeredPlayers: { id: string; socketId: string }[];
  } = { guestPlayers: [], registeredPlayers: [] };

  private guestUsers: GuestUser[] = [];

  private logger = Logger.getInstance();

  private overrideEmit() {
    const originalEmit = this.io.emit.bind(this.io);

    this.io.emit = (event: string, ...args: any[]) => {
      this.logger.debug(`Server emitted event: ${event}`, args, 'Socket');
      return originalEmit(event, ...args);
    };
  }

  private overrideRoomEmit() {
    const originalTo = this.io.to.bind(this.io);

    this.io.to = (room: string) => {
      const roomNamespace = originalTo(room);

      const originalRoomEmit = roomNamespace.emit.bind(roomNamespace);

      roomNamespace.emit = (event: string, ...args: any[]) => {
        this.logger.debug(`Server emitted to room "${room}": Event "${event}"`, args, 'Room');
        return originalRoomEmit(event, ...args);
      };

      return roomNamespace;
    };
  }

  constructor(server: HttpServer) {
    GameSocket.instance = this;
    this.io = new SocketServer(server, {
      cors: {
        methods: ['GET', 'POST'],
        origin: [process.env.CORS_ORIGIN!, 'https://yourdomain.com', 'http://localhost:3000'],
      },
      pingInterval: 10000,
      pingTimeout: 5000,
    });

    // Override the emit method for global logging
    // this.overrideEmit();

    // Override `to(room).emit` for room-specific logging
    this.overrideRoomEmit();

    this.io.use((socket: SocketWithUserID, next) => {
      try {
        const userId = socket.handshake.auth?.userId as string | undefined;

        if (!userId) {
          const guestId = `guest_${this.guestUsers.length + 1}`;
          socket.userid = guestId;
          this.guestUsers.push({ id: guestId, username: `Guest ${this.guestUsers.length + 1}` });

          this.useridToSocket[guestId] = socket.id;

          socket.emit('guest_id_assigned', guestId);
        } else {
          this.useridToSocket[userId] = socket.id;
          socket.userid = userId;

          socket.emit('guest_id_assigned', userId);
        }
        next();
      } catch (error) {
        socket.disconnect(true);
      }
    });

    this.io.on('connection', this.handleConnection);
  }

  private handleConnection = (socket: SocketWithUserID) => {
    console.log(`User connected: ${socket.id} with userid: ${socket.userid}`);

    const originalSocketEmit = socket.emit;
    socket.emit = (event: string, ...args: any[]) => {
      this.logger.debug(`Server emitted to ${socket.id}: ${event}`, args, 'Socket');
      return originalSocketEmit.apply(socket, [event, ...args]);
    };

    socket.onAny((event, ...args) => this.logger.debug(`Received event: ${event}`, args, 'Socket'));
    socket.on('disconnect', () => this.handleDisconnect(socket));
    socket.on('find_match', (msg) => this.handleFindMatch(socket, msg));
    socket.on('join_match', (matchId) => this.joinMatch(socket, matchId));
    socket.on('make_move_match', (props: { matchId: string; move: string }) => {
      const matchRoom = this.matchRooms[props.matchId];
      if (matchRoom) {
        matchRoom.handleRoomMessage(socket, 'match_update', props.move);
      } else {
        this.logger.error('Match room not found', { matchId: props.matchId }, 'MatchRoom');
      }
    });
  };

  private joinMatch = (socket: SocketWithUserID, matchId: string) => {
    socket.join(matchId);
    const matchRoom = this.matchRooms[matchId];
    if (matchRoom) {
      matchRoom.handleRoomMessage(socket, 'get_match_details', {});
    }
    const room = this.io.sockets.adapter.rooms.get(matchId);
    const userCount = room ? room.size : 0;

    this.io.to(matchId).emit('joined_match', userCount);

    const joinMessage = {
      userId: socket.userid,
      userCount,
      timestamp: new Date(),
    };
    this.io.to(matchId).emit('user_joined_room', joinMessage);
  };

  private handleFindMatch = async (socket: SocketWithUserID, msg: { baseTime: number; incrementTime: number }) => {
    const userid = socket.userid as string;
    const isGuest = userid?.startsWith('guest_');

    // Get the appropriate waiting players array
    const waitingPlayersArray = isGuest ? this.waitingplayers.guestPlayers : this.waitingplayers.registeredPlayers;

    // Only proceed if there's a waiting player
    const compatiblePlayer = waitingPlayersArray[0];

    if (!waitingPlayersArray.some((player) => player.id === userid) && compatiblePlayer && userid) {
      let match: {
        id: string;
        whitePlayerId: string;
        blackPlayerId: string;
        baseTime: number;
        incrementTime: number;
        startedAt: Date;
      };

      if (isGuest) {
        match = {
          id: `guest_match_${Date.now()}`,
          baseTime: msg.baseTime,
          incrementTime: msg.incrementTime,
          whitePlayerId: userid,
          blackPlayerId: compatiblePlayer.id,
          startedAt: moment().toDate(),
        };
      } else {
        match = await prisma.match.create({
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
      }

      // Create new match room
      this.matchRooms[match.id] = new MatchRoom(
        match.whitePlayerId,
        match.blackPlayerId,
        new Chess(),
        this.io,
        match.id,
        match.startedAt,
        { baseTime: msg.baseTime, incrementTime: msg.incrementTime }
      );

      this.io.to(compatiblePlayer.socketId).emit('found_match', {
        matchId: match.id,
        color: 'white',
        opponent: match.blackPlayerId,
      });
      socket.emit('found_match', {
        matchId: match.id,
        color: 'black',
        opponent: match.whitePlayerId,
      });

      // Remove both players from waiting list
      if (isGuest)
        this.waitingplayers.guestPlayers = this.waitingplayers.guestPlayers.filter(
          (player) => player.id !== match.whitePlayerId && player.id !== match.blackPlayerId
        );
      else
        this.waitingplayers.registeredPlayers = this.waitingplayers.registeredPlayers.filter(
          (player) => player.id !== match.whitePlayerId && player.id !== match.blackPlayerId
        );
    } else {
      // Add player to appropriate waiting list
      if (isGuest) this.waitingplayers.guestPlayers.push({ id: userid, socketId: socket.id });
      else this.waitingplayers.registeredPlayers.push({ id: userid, socketId: socket.id });
    }
  };

  private handleDisconnect = (socket: SocketWithUserID) => {
    console.log(`User disconnected: ${socket.id} with userid: ${socket.userid}`);
  };
}
