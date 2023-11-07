import axios from "axios";
import { Chess as basicChess, Color, Move, Square } from "chess.js";
import moment from "moment";
import { io, Socket } from "socket.io-client";
async function makeHttpRequest(url: string): Promise<any> {
    try {
        const response = await axios.get(url);
        // You can handle the response data here
        console.log("Response data:", response.data);
        return response.data;
    } catch (error) {
        // Handle errors
        console.error("Error:", (error as Error).message);
        throw error;
    }
}
export class Chess extends basicChess {
    private _moveTime: number[] = [];
    private _whiteTime: number = 0;
    private _blackTime: number = 0;
    private _isOver: string = "";
    private _gameType: { baseTime: number; incrementTime: number };
    private _moveUndone: Move[] = [];
    gameType() {
        return this._gameType;
    }

    constructor(props: { gameType: { baseTime: number; incrementTime: number } }) {
        super();
        this._gameType = props.gameType;
        console.log("inside chess costructor");
    }
    getTimeTillMove = (index: number) => {
        let whiteTimeTaken = 0;
        let blackTimeTaken = 0;
        for (let i = 1; i < index + 2; i += 2) {
            whiteTimeTaken += this._moveTime[i] - this._moveTime[i - 1];
        }
        for (let i = 2; i < index + 2; i += 2) {
            blackTimeTaken += this._moveTime[i] - this._moveTime[i - 1];
        }
        return [whiteTimeTaken, blackTimeTaken];
    };
    updateTime(time: number): number[];
    updateTime(time: number[]): number[];
    updateTime(time: number | number[]): number[] {
        if (Array.isArray(time)) {
            this._moveTime = time;
        } else {
            this._moveTime.push(time);
        }
        return this._moveTime;
    }

    makeMoves(moves: string[]) {
        for (let i = this.history().length; i < moves.length; i++) {
            this.move(moves[i]);
        }
    }
    move(move: string | { from: string; to: string; promotion?: string }, { strict = false }: { strict?: boolean } = {}) {
        const res = super.move(move, { strict });
        [this._whiteTime, this._blackTime] = this.getTimeTillMove(this.history().length);
        return res;
    }
    undo() {
        const res = super.undo();
        if (res !== null) this._moveUndone.push(res);
        [this._whiteTime, this._blackTime] = this.getTimeTillMove(this.history().length);
        return res;
    }
    isOver() {
        return this._isOver;
    }
    whiteTime() {
        return this._whiteTime;
    }
    blackTime() {
        return this._blackTime;
    }
}
