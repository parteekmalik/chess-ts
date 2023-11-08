import { createContext } from "react";
import { Socket } from "socket.io-client";
import { Chess, Color } from "chess.js";
import { selectedPieceProps } from "../../modules/types";
import { ISocketContextActions } from "./SocketReducer";

export interface ISocketContextState {
    socket: Socket | undefined;
    game: Chess;
    movesTime: number[];
    oponentId: string;
    playerId: string;
    whitePlayerId:string;
    blackPlayerId:string;
    matchid: string;
    stats: {
        isover: boolean;
        reason: string;
        winner: string;
    };
    movesUndone: string[];
    selectedPiece: selectedPieceProps;
    flip: Color;
}

export const defaultSocketContextState: ISocketContextState = {
    socket: undefined,
    game: new Chess(),
    movesTime: [],
    whitePlayerId:"",
    blackPlayerId:"",
    oponentId: "",
    playerId: "",
    matchid: "not_set",
    stats: {
        isover: false,
        winner: "",
        reason: "",
    },
    movesUndone: [],
    selectedPiece: { isSelected: false, square: "a1" },
    flip: "w",
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
