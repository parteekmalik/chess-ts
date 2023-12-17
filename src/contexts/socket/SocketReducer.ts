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
    whitePlayerId: string;
    blackPlayerId: string;
    game_stats: string;
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
        game_stats: matchDetails.game_stats,
        gameType: matchDetails.gameType,
        blackPlayerId: matchDetails.blackPlayerId,
        whitePlayerId: matchDetails.whitePlayerId,
        movesTime: [...state.match_prev_details.movesTime, ...matchDetails.movesTime],
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
        movesTime: [...state.match_prev_details.movesTime, move.time],
    };
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
            return { ...state, flip: (state.board_data.flip === "w" ? "b" : "w") as Color };
        case "update_time": {
            const { whiteTime, blackTime } = getTimeTillMove(
                state.match_prev_details.movesTime.length - 1,
                state.match_prev_details.movesTime,
                state.match_details.gameType
            );
            if (action.payload === "w")
                return {
                    ...state,
                    blackTime,
                    whiteTime: blackTime - (moment().toDate().getTime() - moment(getLastElement(state.match_prev_details.movesTime)).toDate().getTime()),
                };
            else
                return {
                    ...state,
                    whiteTime,
                    blackTime: blackTime - (moment().toDate().getTime() - moment(getLastElement(state.match_prev_details.movesTime)).toDate().getTime()),
                };
        }
        case "move_piece": {
            state.SocketEmiter("move_sent", action.payload);
            return state;
        }
        // case "nextMove": {
        //     if (state.curMove === state.onMove) return state;
        //     const { game } = state;
        //     game.move(state.puzzle?.moves[state.curMove] as string);
        //     return { ...state, game, wrongMove: false, curMove: state.curMove + 1 };
        // }
        // case "prevMove": {
        //     if (state.curMove === 0) return state;
        //     const { game } = state;
        //     game.undo();
        //     return { ...state, game, wrongMove: false, curMove: state.curMove - 1 };
        // }
        // case "undoMove": {
        //     if (!state.wrongMove) return state;
        //     const { game } = state;
        //     game.undo();
        //     return { ...state, game, wrongMove: false, curMove: state.curMove - 1, onMove: state.onMove - 1 };
        // }
        default:
            return state;
    }
};
