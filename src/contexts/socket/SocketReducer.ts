import moment from "moment";
import { ISocketContextState } from "./SocketContext";
import { Socket } from "socket.io-client";
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
    movesData: { move: string; time: string }[];
    startedAt: string;
    gameType: {
        baseTime: number;
        incrementTime: number;
    };
    mySide: Color;
}

export interface moveType {
    move: string;
    time: string;
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
    | { type: "update_board_data"; payload: number }
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
            const movesData: { move: string; time: string; board_layout: string }[] = [];

            for (let i = 0; i < payload.movesData.length; i++) {
                if (i !== 0) game.move(payload.movesData[i].move);
                movesData.push({ ...payload.movesData[i], board_layout: game.fen() });
            }

            return {
                ...state,
                game,
                game_stats: payload.stats,
                match_details: {
                    ...state.match_details,
                    gameType: payload.gameType,
                    blackId: payload.blackId,
                    whiteId: payload.whiteId,
                },
                board_data: {
                    ...state.board_data,
                    board_layout: game.fen(),
                    solveFor: payload.mySide,
                    flip: payload.mySide,
                    curMove: movesData.length - 1,
                    onMove: movesData.length - 1,
                },
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
            return { ...state, board_data: { ...state.board_data, selectedPiece: action.payload } };
        case "flip_board":
            return { ...state, board_data: { ...state.board_data, flip: (state.board_data.flip === "w" ? "b" : "w") as Color } };
        case "update_time": {
            return { ...state, board_data: { ...state.board_data, ...getTimeLeft(state, action) } };
        }
        case "move_piece": {
            state.socket?.emit("move_sent", action.payload);
            return state;
        }
        case "nextMove": {
            if (state.board_data.curMove === state.board_data.onMove) return state;
            return { ...state, board_data: { ...state.board_data, curMove: state.board_data.curMove + 1 } };
        }
        case "prevMove": {
            if (state.board_data.curMove === 0) return state;
            return { ...state, board_data: { ...state.board_data, curMove: state.board_data.curMove - 1 } };
        }
        case "update_board_data": {
            return {
                ...state,
                board_data: { ...state.board_data, board_layout: state.movesData[action.payload].board_layout },
            };
        }
        default:
            return state;
    }
};

const getTimeLeft = (state: ISocketContextState, action: ISocketContextActions) => {
    const { whiteTime, blackTime } = getTimeTillMove(null, state.movesData, state.match_details.gameType);
    const lastMoveTime = state.movesData.length === 0 ? state.startedAt : getLastElement(state.movesData).time;
    if (lastMoveTime === undefined) return { blackTime: 0, whiteTime: 0 };
    // console.log(lastMoveTime);
    if (action.payload === "w")
        return {
            blackTime,
            whiteTime: whiteTime - (moment().toDate().getTime() - moment(lastMoveTime).toDate().getTime()),
        };
    else
        return {
            whiteTime,
            blackTime: blackTime - (moment().toDate().getTime() - moment(lastMoveTime).toDate().getTime()),
        };
};
