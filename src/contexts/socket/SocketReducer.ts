import moment from "moment";
import { ISocketContextState } from "./SocketContext";
import { Socket } from "socket.io-client";
import { selectedPieceProps } from "../../modules/types";
import { Color, Square } from "chess.js";
import { getLastElement, getTimeTillMove } from "../../modules/Utils";

export interface moveTimeType {
    whiteTime: number;
    blackTime: number;
}
export interface matchDetailsType {
    stats: string;
    whiteId: string;
    blackId: string;
    movesData: { move: string; time: number }[];
    startedAt: number;
    gameType: {
        baseTime: number;
        incrementTime: number;
    };
    mySide: Color;
}

export interface moveType {
    move: string;
    time: number;
}
export type ISocketContextActions =
    | { type: "flip_board"; payload: null }
    | { type: "update_socket"; payload: [Socket, string] }
    | { type: "init_match"; payload: matchDetailsType }
    | { type: "recived_move"; payload: moveType }
    | { type: "update_matchid"; payload: string }
    | { type: "update_selected_square"; payload: Square | "" }
    | { type: "undoMove"; payload: null }
    | { type: "prevMove"; payload: null }
    | { type: "nextMove"; payload: null }
    | { type: "move_piece"; payload: { from: Square; to: Square } | string }
    | { type: "update_time"; payload: Color };
const ignoreTypes = ["update_time"];

export const SocketReducer = (state: ISocketContextState, action: ISocketContextActions) => {
    if (!ignoreTypes.includes(action.type)) console.log("Update State - Action: " + action.type + " - Payload: ", action.payload);
    switch (action.type) {
        case "update_socket": {
            const [socket, matchid] = action.payload;
            return { ...state, matchid, socket };
        }
        case "init_match": {
            const { game } = state;
            const { payload } = action;
            const movesData: { move: string; time: number; board_layout: string }[] = [];

            for (let i = game.history().length; i < payload.movesData.length; i++) {
                game.move(payload.movesData[i].move);
                movesData.push({ ...payload.movesData[i], board_layout: game.fen() });
            }

            return {
                ...state,
                game,
                game_stats: payload.stats,
                gameType: payload.gameType,
                blackPlayerId: payload.blackId,
                whitePlayerId: payload.whiteId,
                board_data: { ...state.board_data, board_layout: game.fen(), solveFor: payload.mySide, flip: payload.mySide },
                movesData,
                startedAt: payload.startedAt,
            };
        }
        case "recived_move": {
            const { game } = state;
            const { payload } = action;
            game.move(payload.move);
            return {
                ...state,
                game,
                movesData: [...state.movesData, { ...payload, board_layout: game.fen() }],
                board_data: { ...state.board_data, board_layout: game.fen() },
            };
        }
        case "update_matchid":
            return { ...state, matcid: action.payload };
        case "update_selected_square":
            return { ...state, selectedPiece: action.payload };
        case "flip_board":
            return { ...state, board_data: { ...state.board_data, flip: (state.board_data.flip === "w" ? "b" : "w") as Color } };
        case "update_time": {
            const { whiteTime, blackTime } = getTimeTillMove(state.movesData.length, state.startedAt, state.movesData, state.match_details.gameType);
            const lastMoveTime = getLastElement(state.movesData);
            if (lastMoveTime === undefined) return state;
            // console.log(lastMoveTime);
            if (action.payload === "w")
                return {
                    ...state,
                    blackTime,
                    board_data: { ...state.board_data, whiteTime: blackTime - (moment().toDate().getTime() - moment(lastMoveTime.time).toDate().getTime()) },
                };
            else
                return {
                    ...state,
                    whiteTime,
                    board_data: { ...state.board_data, blackTime: blackTime - (moment().toDate().getTime() - moment(lastMoveTime.time).toDate().getTime()) },
                };
        }
        case "move_piece": {
            state.socket?.emit("move_sent", action.payload);
            return state;
        }
        /*case "nextMove": {
            if (state.curMove === state.onMove) return state;
            const { game } = state;
            game.move(state.puzzle?.moves[state.curMove] as string);
            return { ...state, game, wrongMove: false, curMove: state.curMove + 1 };
        }
        case "prevMove": {
            if (state.curMove === 0) return state;
            const { game } = state;
            game.undo();
            return { ...state, game, wrongMove: false, curMove: state.curMove - 1 };
        }
        case "undoMove": {
            if (!state.wrongMove) return state;
            const { game } = state;
            game.undo();
            return { ...state, game, wrongMove: false, curMove: state.curMove - 1, onMove: state.onMove - 1 };
        }*/
        default:
            return state;
    }
};
