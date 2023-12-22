import { Chess, Color, DEFAULT_POSITION, PieceSymbol, Square } from "chess.js";
import { createContext } from "react";
import { Tboard_data } from "../../1making common component/board";
import { IPuzzleContextActions } from "./PuzzleReducer";
export type Tpuzzle = {
    id: number;
    fen: string;
    moves: string[];
    opening_tags: string[];
    rating: number;
    rating_deviation: number;
    themes: string[];
    solved: boolean;
};
export interface ICommonContextState {
    board_data: Tboard_data;
    game: Chess;
    curMove: number;
    onMove: number;
}

export interface IPuzzleContextState extends ICommonContextState {
    type: "puzzle" ;
    puzzleList: Tpuzzle[];
    puzzle: Tpuzzle | null;
    puzzleNo: number;
    livesLeft: number;
}
export const defaultPuzzleContextState: IPuzzleContextState = {
    puzzleList: [],
    puzzle: null,
    puzzleNo: 0,
    game: new Chess(),
    curMove: 1,
    onMove: 1,
    livesLeft: 3,
    board_data: {
        board_layout: DEFAULT_POSITION,
        flip: "w",
        selectedPiece: "",
        lastMove: undefined,
        solveFor: "w",
    },
    type: "puzzle",
};

export interface IPuzzleContextProps {
    PuzzleState: IPuzzleContextState;
    PuzzleDispatch: React.Dispatch<IPuzzleContextActions>;
}

const PuzzleContext = createContext<IPuzzleContextProps>({
    PuzzleState: defaultPuzzleContextState,
    PuzzleDispatch: () => {},
});

export const PageContextConsumer = PuzzleContext.Consumer;
export const PuzzleContextProvider = PuzzleContext.Provider;

export default PuzzleContext;
