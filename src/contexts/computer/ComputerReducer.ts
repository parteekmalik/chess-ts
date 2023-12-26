import { Chess, Color, PieceSymbol, Square } from "chess.js";
import { Tboard_data } from "../../modules/board/board";
import { IComputerContextState } from "./ComputerContext";

export type IComputerContextActions =
    | { type: "update_selected_square"; payload: Square | "" }
    | { type: "move_piece"; payload: { from: string; to: string } | string }
    | { type: "prevMove"; payload: null }
    | { type: "nextMove"; payload: null }
    | { type: "flip_board"; payload: null };

const update_board = (props: { game: Chess; board_data: Tboard_data }) => {
    const { game, board_data } = props;
    const new_board_data = { ...board_data, board_layout: game.fen(), lastMove: game.history({ verbose: true })[game.history().length - 1] };
    return new_board_data;
};


export const ComputerReducer = (state: IComputerContextState, action: IComputerContextActions) => {
    console.log("Update State - Action: " + action.type + " - Payload: ", action.payload);
    switch (action.type) {

        case "update_selected_square":
            return { ...state, board_data: { ...state.board_data, selectedPiece: action.payload } };
        case "flip_board":
            return { ...state, flip: (state.board_data.flip === "w" ? "b" : "w") as Color };
        case "move_piece": {
            const { game, board_data } = state;
            try {
                game.move(action.payload);
            } catch {
                try {
                    game.move({ ...(action.payload as { from: string; to: string }), promotion: "q" as PieceSymbol });
                } catch {
                    console.log("wrong move");
                    return state;
                }
            }
            const moveN = state.board_data.onMove + 1;
            return { ...state, game, board_data: update_board({ board_data, game }), selectedPiece: "" as "", onMove: moveN, curMove: moveN };
        }
        case "nextMove": {
            if (state.board_data.curMove === state.board_data.onMove) return state;
            return { ...state, board_data: { ...state.board_data, curMove: state.board_data.curMove + 1 } };
        }
        case "prevMove": {
            if (state.board_data.curMove === 0) return state;
            return { ...state, board_data: { ...state.board_data, curMove: state.board_data.curMove - 1 } };
        }
        default:
            return state;
    }
};
