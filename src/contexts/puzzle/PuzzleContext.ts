import { Chess, Color, PieceSymbol, Square } from "chess.js";
import { createContext } from "react";
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

export interface IPuzzleContextState {
    puzzleList: Tpuzzle[];
    puzzle: Tpuzzle | null;
    puzzleNo: number;
    game: Chess;
    selectedPiece: Square | "";
    solveFor: Color;
    flip: Color;
    wrongMove: boolean;
    livesLeft: number;
    curMove: number;
    onMove: number;
}

export const defaultPuzzleContextState: IPuzzleContextState = {
    puzzleList: [],
    puzzle: null,
    puzzleNo: 0,
    game: new Chess(),
    selectedPiece: "",
    solveFor: "w",
    flip: "w",
    wrongMove: false,
    curMove: 1,
    onMove: 1,
    livesLeft: 3,
};

export type IPuzzleContextActions =
    | { type: "update_selected_square"; payload: Square | "" }
    | { type: "update_puzzle_list"; payload: Tpuzzle[] }
    | { type: "move_piece"; payload: { from: string; to: string } | string }
    | { type: "flag_wrong_move"; payload: null }
    | { type: "undoMove"; payload: null }
    | { type: "prevMove"; payload: null }
    | { type: "nextMove"; payload: null }
    | { type: "update_puzzle"; payload: number }
    | { type: "flip_board"; payload: null };

export const PuzzleReducer = (state: IPuzzleContextState, action: IPuzzleContextActions) => {
    console.log("Update State - Action: " + action.type + " - Payload: ", action.payload);
    switch (action.type) {
        case "update_puzzle_list": {
            const puzzle = action.payload[0];
            const game = new Chess(puzzle.fen);
            game.move(puzzle.moves[0]);
            return {
                ...state,
                puzzleList: action.payload.map((data) => ({ ...data, solved: false } as Tpuzzle)),
                puzzle,
                game,
                solveFor: game.turn(),
                flip: game.turn(),
            };
        }
        case "update_puzzle": {
            const puzzleList = state.puzzleList;
            console.log(puzzleList[state.puzzleNo]);
            puzzleList[state.puzzleNo].solved = true;
            const puzzle = state.puzzleList[action.payload];
            const game = new Chess(puzzle.fen);
            game.move(puzzle.moves[0]);
            return { ...state, puzzle, game, solveFor: game.turn(), flip: game.turn(), puzzleNo: action.payload, puzzleList, curMove: 1, onMove: 1 };
        }
        case "update_selected_square":
            return { ...state, selectedPiece: action.payload };
        case "flip_board":
            return { ...state, flip: (state.flip === "w" ? "b" : "w") as Color };
        case "move_piece": {
            if (state.wrongMove) return state;
            const { game } = state;
            try {
                game.move(action.payload);
            } catch {
                try {
                    game.move({ ...(action.payload as { from: string; to: string }), promotion: "q" as PieceSymbol });
                } catch {
                    console.log("wrong move");
                }
            }
            const moveN = state.onMove + 1;
            return { ...state, game, selectedPiece: "" as "", onMove: moveN, curMove: moveN };
        }
        case "flag_wrong_move":
            return { ...state, wrongMove: true };
        case "nextMove": {
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
        }
        default:
            return state;
    }
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
