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
};

export interface IPuzzleContextState {
    puzzle: Tpuzzle | null;
    game: Chess;
    selectedPiece: Square | "";
    solveFor: Color;
    flip: Color;
    wrongMove: boolean;
}

export const defaultPuzzleContextState: IPuzzleContextState = {
    puzzle: null,
    game: new Chess(),
    selectedPiece: "",
    solveFor: "w",
    flip: "w",
    wrongMove: false,
};
export type TPuzzleContextActions = "update_puzzle" | "update_game" | "update_selected_square" | "undo" | "flip_board" | "flag_wrong_move" | "move_piece";
export type TPuzzleContextPayload = string | null | Tpuzzle | Chess | Square | { from: string; to: string };

export interface IPuzzleContextActions {
    type: TPuzzleContextActions;
    payload: TPuzzleContextPayload;
}
export const PuzzleReducer = (state: IPuzzleContextState, action: IPuzzleContextActions) => {
    console.log("Update State - Action: " + action.type + " - Payload: ", action.payload);

    switch (action.type) {
        case "update_puzzle": {
            const game = new Chess((action.payload as Tpuzzle).fen);
            game.move((action.payload as Tpuzzle).moves[0]);
            return { ...state, puzzle: action.payload as Tpuzzle, game, solveFor: game.turn(), flip: game.turn() };
        }
        case "update_selected_square":
            return { ...state, selectedPiece: action.payload as Square | "" };
        case "flip_board":
            return { ...state, flip: (state.flip === "w" ? "b" : "w") as Color };
        case "move_piece": {
            if (state.wrongMove) return state;
            const { game } = state;
            try {
                game.move(action.payload as string | { from: string; to: string });
            } catch {
                try {
                    game.move({ ...(action.payload as { from: string; to: string }), promotion: "q" as PieceSymbol });
                } catch {
                    console.log("wrong move");
                }
            }
            return { ...state, game };
        }
        case "flag_wrong_move":
            return { ...state, wrongMove: true };
        case "undo": {
            const { game } = state;
            game.undo();
            return { ...state, game, wrongMove: false };
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
