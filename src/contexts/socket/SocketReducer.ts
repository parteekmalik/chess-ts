import moment from "moment";
import { ISocketContextState } from "./SocketContext";
import { Socket } from "socket.io-client";
import { selectedPieceProps } from "../../modules/types";
import { Color, Square } from "chess.js";
import { getLastElement, getTimeTillMove } from "../../modules/Utils";

export type TSocketContextActions =
    | "update_timeDiff"
    | "flip_board"
    | "update_socket"
    | "init_match"
    | "recived_move"
    | "update_matchid"
    | "update_selected_square"
    | "update_time"
    | "updateTime";
export type TSocketContextPayload = { whiteTime: number; blackTime: number } | number | null | [Socket, string] | matchDetailsType | moveType | string | (Square | "");

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
    stats: string;
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
const ignoreTypes = ["update_selected_square", "update_time", "update_timeDff"];
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
        case "update_time":
            const { whiteTime, blackTime } = getTimeTillMove(state.movesTime.length - 1, state.movesTime, state.gameType);
            if(action.payload == "w")return {
                ...state,
                blackTime,
                whiteTime: blackTime - (moment().toDate().getTime() - moment(getLastElement(state.movesTime)).toDate().getTime()),
            };
            else return {
                ...state,
                whiteTime,
                blackTime: blackTime - (moment().toDate().getTime() - moment(getLastElement(state.movesTime)).toDate().getTime()),
            };
        default:
            return state;
    }
};
