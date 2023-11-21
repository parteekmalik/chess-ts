import { createContext } from "react";
import { Socket } from "socket.io-client";
import { Chess, Color, Square } from "chess.js";
import { selectedPieceProps } from "../../modules/types";
import { ISocketContextActions, moveTimeType } from "./SocketReducer";

export interface ISocketContextState {
    socket: Socket | undefined;
    whitePlayerId: string;
    blackPlayerId: string;
    matchid: string;
    stats: string;
    gameType: { baseTime: number; incrementTime: number };
    game: Chess;
    flip: Color;
    selectedPiece: Square | "";
    movesUndone: string[];
    movesTime: number[];
    whiteTime: number;
    blackTime: number;
}

export const defaultSocketContextState: ISocketContextState = {
    socket: undefined,
    whitePlayerId: "",
    blackPlayerId: "",
    matchid: "not_set",
    stats: "",
    gameType: { baseTime: 0, incrementTime: 0 },
    game: new Chess(),
    flip: "w",
    selectedPiece: "",
    movesUndone: [],
    movesTime: [],
    whiteTime: 0,
    blackTime: 0,
};

export interface ISocketContextProps {
    SocketState: ISocketContextState;
    SocketDispatch: React.Dispatch<ISocketContextActions>;
    SocketEmiter: (type: string, payload: any) => void;
}

const SocketContext = createContext<ISocketContextProps>({
    SocketState: defaultSocketContextState,
    SocketDispatch: () => {},
    SocketEmiter: () => {},
});

export const SocketContextConsumer = SocketContext.Consumer;
export const SocketContextProvider = SocketContext.Provider;

export default SocketContext;
