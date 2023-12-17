import { createContext } from "react";
import { Socket } from "socket.io-client";
import { Chess, Color, DEFAULT_POSITION, Square } from "chess.js";
import { selectedPieceProps } from "../../modules/types";
import { ISocketContextActions, moveTimeType } from "./SocketReducer";
import { Tboard_data } from "../../1making common component/board";

export interface ISocketContextState {
    socket: Socket | undefined;
    game: Chess;
    match_details: {
        blackPlayerId: string;
        whitePlayerId: string;
        matchid: string;
        game_stats: string;
        gameType: {
            baseTime: number;
            incrementTime: number;
        };
    };

    match_prev_details: {
        board_moves_layout: string[];
        movesTime: number[];
        movesUndone: string[];
    };
    board_data: Tboard_data;
    SocketEmiter: (type: string, payload: any) => void; 
}

export const defaultSocketContextState: ISocketContextState = {
    socket: undefined,
    game: new Chess(),
    match_details: {
        blackPlayerId: "",
        whitePlayerId: "",
        matchid: "not_set",
        game_stats: "",
        gameType: { baseTime: 0, incrementTime: 0 },
    },
    match_prev_details: {
        board_moves_layout: [],
        movesTime: [],
        movesUndone: [],
    },
    board_data: {
        board_layout: DEFAULT_POSITION,
        flip: "w",
        selectedPiece: "",
        whiteTime: 0,
        blackTime: 0,
        lastMove: undefined,
    },
    SocketEmiter : function (type: string, payload: any) {
        console.info("Emitted - Action: " + type + " - Payload: ", payload);
        this.socket?.emit(type, payload);
    }
};

export interface ISocketContextProps {
    SocketState: ISocketContextState;
    SocketDispatch: React.Dispatch<ISocketContextActions>;
}

const SocketContext = createContext<ISocketContextProps>({
    SocketState: defaultSocketContextState,
    SocketDispatch: () => {},
});

export const SocketContextConsumer = SocketContext.Consumer;
export const SocketContextProvider = SocketContext.Provider;

export default SocketContext;
