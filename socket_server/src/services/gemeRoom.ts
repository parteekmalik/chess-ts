import { Chess, Color, PieceSymbol, Square } from 'chess.js';
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

  public isPlayersTurn(userId: string): boolean {
    return this.players[this.game.turn()] === userId;
  }

  public handleMove(socket: SocketWithUserID, msg: { from: Square; to: Square }, matchId: string) {
    console.log('Received move:', msg);
    const { from, to } = msg;

    if (!this.isPlayersTurn(socket.userid!)) {
      console.log('Sending error - not player turn');
      socket.emit('error', 'Not your turn or you are not a player in this game');
      return;
    }

    const tryMove = (promotion?: PieceSymbol) => {
      if (this.makeMove(from, to, promotion)) {
        const gameState = this.getGameState();
        console.log('Sending game state:', gameState);
        this.io.to(matchId).emit('match_update', gameState);
        return true;
      }
      return false;
    };

    if (!tryMove() && !tryMove('q')) {
      console.log('Sending error - invalid move');
      socket.emit('error', 'Invalid move');
    }
  }

  public makeMove(from: Square, to: Square, promotion?: PieceSymbol): boolean {
    try {
      this.game.move({ from, to, promotion });
      this.movesTime.push(moment().toDate());
      this.updateGameStatus();
      return true;
    } catch {
      return false;
    }
  }

  public oppositeTurn(turn: Color): Color {
    return turn === 'w' ? 'b' : 'w';
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
    switch (type) {
      case 'match_update':
        this.handleMove(socket, payload as { from: Square; to: Square }, this.matchId);
        break;
      case 'get_match_details':
        socket.emit('set_match_details', this.getGameState());
        setTimeout(() => {
          socket.emit('match_ended', {
            ...this.getGameState(),
            stats: { isover: true, winner: 'w', reason: 'resignation' },
          });
        }, 10000);
        break;
      case 'default':
        this.broadcastMessage(socket.userid!, type, payload);
        break;
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
