import { createContext } from "react";
import { Socket } from "socket.io-client";
import { Chess, Color, DEFAULT_POSITION, Square } from "chess.js";
import { selectedPieceProps } from "../../modules/types";
import { ISocketContextActions, moveTimeType } from "./SocketReducer";
import { Tboard_data } from "../../1making common component/board";
import { ICommonContextState } from "../puzzle/PuzzleContext";

export interface ISocketContextState extends ICommonContextState {
    type: "live";
    socket: Socket | undefined;
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
    startedAt: number;
    movesData: { move: string; time: number; board_layout: string }[];
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
    startedAt: 0,
    movesData: [],
    curMove: 0,
    onMove: 0,
    board_data: {
        board_layout: DEFAULT_POSITION,
        flip: "w",
        selectedPiece: "",
        lastMove: undefined,
        solveFor: "w",
        whiteTime: 0,
        blackTime: 0,
    },
    type: "live",
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
