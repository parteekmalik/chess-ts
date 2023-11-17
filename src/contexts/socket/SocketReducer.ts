import moment from "moment";
import { ISocketContextState } from "./SocketContext";
import { Socket } from "socket.io-client";
import { selectedPieceProps } from "../../modules/types";
import { Color, Square } from "chess.js";
import { getLastElement } from "../../modules/Utils";

export type TSocketContextActions =
    | "update_timeDiff"
    | "flip_board"
    | "update_socket"
    | "init_match"
    | "recived_move"
    | "update_matchid"
    | "update_selected_square"
    | "update_white_time"
    | "update_black_time";
export type TSocketContextPayload = number | null | [Socket, string] | matchDetailsType | moveType | string | (Square | "");

export interface ISocketContextActions {
    type: TSocketContextActions;
    payload: TSocketContextPayload;
}
export interface moveTimeType {
    whiteTime: number;
    blackTime: number;
}
export interface matchDetailsType {
    whitePlayerId: string;
    blackPlayerId: string;
    stats: {
        isover: boolean;
        reason: string;
        winner: string;
    };
    gameType: { baseTime: number; incrementTime: number };
    moves: string[];
    movesTime: number[];
    startedAt: number;
}

function makePrevMoves(state: ISocketContextState, matchDetails: matchDetailsType) {
    const { game } = state;
    for (let i = game.history().length; i < matchDetails.moves.length; i++) game.move(matchDetails.moves[i]);
    return {
        ...state,
        game,
        stats: matchDetails.stats,
        gameType: matchDetails.gameType,
        blackPlayerId: matchDetails.blackPlayerId,
        whitePlayerId: matchDetails.whitePlayerId,
        movesTime: [...state.movesTime, ...matchDetails.movesTime],
    };
}
export interface moveType {
    move: string;
    time: number;
}
function makeMove(state: ISocketContextState, move: moveType) {
    const { game } = state;
    game.move(move.move);

    return {
        ...state,
        game,
        movesTime: [...state.movesTime, move.time],
    };
}
const ignoreTypes = ["update_selected_square", "update_black_time", "update_white_time", "update_timeDff"];
export const SocketReducer = (state: ISocketContextState, action: ISocketContextActions) => {
    if (!ignoreTypes.includes(action.type)) console.log("Update State - Action: " + action.type + " - Payload: ", action.payload);

    switch (action.type) {
        case "update_socket": {
            const [socket, matchid] = action.payload as [Socket, string];
            return { ...state, matchid, socket };
        }
        case "init_match":
            return makePrevMoves(state, action.payload as matchDetailsType);
        case "recived_move":
            return makeMove(state, action.payload as moveType);
        case "update_matchid":
            return { ...state, matcid: action.payload as string };
        case "update_selected_square":
            return { ...state, selectedPiece: action.payload as Square | "" };
        case "flip_board":
            return { ...state, flip: (state.flip === "w" ? "b" : "w") as Color };
        case "update_black_time": {
            const { blackTime, whiteTime } = getTimeTillMove(state.game.history().length, state.movesTime, state.gameType);
            return {
                ...state,
                whiteTime,
                blackTime: blackTime - (moment().toDate().getTime() - getLastElement(state.movesTime)),
            };
        }
        case "update_white_time": {
            const { blackTime, whiteTime } = getTimeTillMove(state.game.history().length, state.movesTime, state.gameType);
            return {
                ...state,
                blackTime,
                whiteTime: whiteTime - (moment().toDate().getTime() - getLastElement(state.movesTime)),
            };
        }
        default:
            return state;
    }
};
const getTimeTillMove = (index: number, moveTime: number[], gameType: { baseTime: number; incrementTime: number }) => {
    // if (typeof moveTime[0] === "string") moveTime = moveTime.map((d) => moment(d).toDate().getTime()) as number[];
    let whiteTime = gameType.baseTime;
    let blackTime = gameType.baseTime;
    for (let i = 1; i <= index; i += 2) {
        whiteTime -= (moveTime[i] as number) - (moveTime[i - 1] as number);
    }
    for (let i = 2; i <= index; i += 2) {
        blackTime -= (moveTime[i] as number) - (moveTime[i - 1] as number);
    }
    const res = { whiteTime, blackTime };
    // console.log(res);
    return res;
};
