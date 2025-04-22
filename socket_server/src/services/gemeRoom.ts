import { Chess, Color } from 'chess.js';
import moment from 'moment';
import { Socket, Server as SocketServer } from 'socket.io';
import { Logger } from './Logger';

interface SocketWithUserID extends Socket {
  userid?: string;
}

export class MatchRoom {
  private players: { [color: string]: string };

  private game: Chess; // chess.js game instance

  private startedAt: Date;

  private movesTime: Date[];

  private stats: { isover: boolean; winner: Color | 'draw'; reason: string } | null;

  private io: SocketServer;

  private matchId: string;

  private config: { baseTime: number; incrementTime: number };

  private logger = Logger.getInstance();

  constructor(
    whitePlayer: string,
    blackPlayer: string,
    game: any,
    io: SocketServer,
    matchId: string,
    startedAt: Date,
    config: { baseTime: number; incrementTime: number }
  ) {
    this.players = {
      w: whitePlayer,
      b: blackPlayer,
    };
    this.game = game;
    this.startedAt = startedAt;
    this.movesTime = [];
    this.stats = null;
    this.io = io;
    this.matchId = matchId;
    this.config = config;
  }

  public oppositeTurn(turn: Color): Color {
    return turn === 'w' ? 'b' : 'w';
  }

  private isPlayersTurn(userId: string): boolean {
    return this.players[this.game.turn()] === userId;
  }

  private checkAuthorisation(id: string) {
    return Object.values(this.players).includes(id);
  }

  private handleMove(socket: SocketWithUserID, move: string, matchId: string) {
    try {
      this.game.move(move);
      this.movesTime.push(moment().toDate());
      
      const gameState = this.getGameState();
      this.io.to(matchId).emit('match_update', gameState);
    } catch {
      socket.emit('error', 'Invalid move');
    }
  }

  private updateGameStatus() {
    if (this.game.isDraw()) {
      this.stats = { isover: true, winner: 'draw', reason: 'repetition' };
    } else if (this.game.isCheckmate()) {
      this.stats = {
        isover: true,
        winner: this.oppositeTurn(this.game.turn()),
        reason: 'checkmate',
      };
    }
  }

  public calculateTimeLeft(turn: Color, movesTimes: Date[], testing = false): number {
    const tempList = [this.startedAt, ...movesTimes];
    let movesTime = tempList.map((move) => moment(move).valueOf());
    if (testing)
      movesTime = Array.from({ length: 6 }, (_, i) =>
        moment(this.startedAt)
          .add(i * 10, 'seconds')
          .valueOf()
      );
    let timeLeft = this.config.baseTime;
    if (turn === 'w') {
      for (let i = 1; i < movesTime.length; i += 2) {
        timeLeft -= movesTime[i] - movesTime[i - 1];
        // timeLeft += this.config.incrementTime;
      }
    } else {
      for (let i = 2; i < movesTime.length; i += 2) {
        timeLeft -= movesTime[i] - movesTime[i - 1];
        // timeLeft += this.config.incrementTime;
      }
    }
    if (turn === this.game.turn()) timeLeft -= moment().valueOf() - movesTime[movesTime.length - 1];

    return timeLeft;
  }

  public getGameState() {
    return {
      moves: this.game.history(),
      players: {
        w: { id: this.players.w, timeLeft: this.calculateTimeLeft('w', this.movesTime) },
        b: { id: this.players.b, timeLeft: this.calculateTimeLeft('b', this.movesTime) },
      },
      matchId: this.matchId,
      stats: this.stats,
      config: this.config,
    };
  }

  public handleRoomMessage(socket: SocketWithUserID, type: string, payload: unknown) {
    const authMap: { [key: string]: string } = {
      'get_match_details': 'public',
      'match_update': 'player',
      'default': 'playerTurn',
    };

    const isAuthorised = this.checkAuthorisation(socket.userid!);
    const isPlayerTurn = this.isPlayersTurn(socket.userid!);
    
    if (!isAuthorised && authMap[type] !== 'public') {
      socket.emit('dockt', { message: 'Unauthorized access' });
      return;
    }
    if (!isPlayerTurn && authMap[type] !== 'playerTurn') {
      socket.emit('dockt', { message: 'Unauthorized access not yourr turn' });
      return;
    }

    switch (type) {
      case 'get_match_details':
        socket.emit('set_match_details', this.getGameState());
        break;
      case 'default':
        this.broadcastMessage(socket.userid!, type, payload);
        break;
    }

    if (isPlayerTurn) {
      switch (type) {
        case 'match_update': {
          this.handleMove(socket, payload as string, this.matchId);
          break;
        }
        case 'default': {
          this.logger.info('ddefault', { type, payload });
          break;
        }
      }
    } 
  }

  private broadcastMessage(userId: string, type: string, payload: unknown) {
    const message = {
      userId,
      type,
      payload,
      timestamp: new Date(),
    };
    console.log('Broadcasting message:', message);
    this.io.to(this.matchId).emit('room_message', message);
  }
}
