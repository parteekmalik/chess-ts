import moment from "moment";
import { ISocketContextState } from "./SocketContext";
import { Socket } from "socket.io-client";
import { selectedPieceProps } from "../../modules/types";

export type TSocketContextActions = "flip_board" | "update_socket" | "init_match" | "recived_move" | "update_matchid" | "update_selected_square";
export type TSocketContextPayload = null | [Socket, string] | matchDetailsType | moveType | string | selectedPieceProps;

export interface ISocketContextActions {
    type: TSocketContextActions;
    payload: TSocketContextPayload;
}
export interface matchDetailsType {
    moves: string[];
    movesTime: string[];
    oponentId: string;
    playerId: string;
    stats: {
        isover: boolean;
        reason: string;
        winner: string;
    };
}
export interface moveType {
    move: string;
    time: string;
}
function makePrevMoves(state: ISocketContextState, matchDetails: matchDetailsType) {
    const { game } = state;
    const { moves, playerId, oponentId, stats } = matchDetails;
    for (let i = game.history().length; i < moves.length; i++) game.move(moves[i]);
    return {
        ...state,
        game,
        movesTime: matchDetails.movesTime.map((d) => moment(d).toDate().getTime()),
        oponentId,
        playerId,
        stats,
    };
}
function makeMove(state: ISocketContextState, move: moveType) {
    const { game, movesTime } = state;
    game.move(move.move);
    movesTime.push(moment(move.time).toDate().getTime());
    return { ...state, game, movesTime };
}

export const SocketReducer = (state: ISocketContextState, action: ISocketContextActions) => {
    if (action.type !== "update_selected_square") console.log("Update State - Action: " + action.type + " - Payload: ", action.payload);

    switch (action.type) {
        case "update_socket":
            const [socket, matchid] = action.payload as [Socket, string];
            return { ...state, matchid, socket };
        case "init_match":
            return makePrevMoves(state, action.payload as matchDetailsType);
        case "recived_move":
            return makeMove(state, action.payload as moveType);
        case "update_matchid":
            return { ...state, matcid: action.payload as string };
        case "update_selected_square":
            return { ...state, selectedPiece: action.payload as selectedPieceProps };
        case "flip_board":
            return { ...state, flip: state.flip === "w" ? "b" : "w" };
        default:
            return state;
    }
};
