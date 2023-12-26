import { Chess, Color, PieceSymbol, Square } from "chess.js";
import { Tboard_data } from "../../modules/board/board";
import { IPuzzleContextState, Tpuzzle } from "./PuzzleContext";

export type IPuzzleContextActions =
    | { type: "update_selected_square"; payload: Square | "" }
    | { type: "update_puzzle_list"; payload: Tpuzzle[] }
    | { type: "move_piece"; payload: { from: string; to: string } | string }
    | { type: "flag_wrong_move"; payload: null }
    | { type: "undoMove"; payload: null }
    | { type: "prevMove"; payload: null }
    | { type: "nextMove"; payload: null }
    | { type: "update_puzzle"; payload: number }
    | { type: "update_puzzle_result"; payload: boolean }
    | { type: "flip_board"; payload: null };

const update_board = (props: { game: Chess; board_data: Tboard_data }) => {
    const { game, board_data } = props;
    const new_board_data = { ...board_data, board_layout: game.fen(), lastMove: game.history({ verbose: true })[game.history().length - 1] };
    return new_board_data;
};
const update_puzzle = ({ puzzleList, board_data, puzzleNo }: { puzzleList: Tpuzzle[]; board_data: Tboard_data; puzzleNo: number }) => {
    const puzzle = puzzleList[puzzleNo];
    console.log("puzzle updated -> ", puzzle);

    const game = new Chess(puzzle.fen);
    game.move(puzzle.moves[0]);

    board_data.solveFor = game.turn();
    board_data.flip = game.turn();

    return { puzzle, game, puzzleNo, board_data: { ...update_board({ board_data, game }), curMove: 1, onMove: 1 } };
};

export const PuzzleReducer = (state: IPuzzleContextState, action: IPuzzleContextActions) => {
    console.log("Update State - Action: " + action.type + " - Payload: ", action.payload);
    switch (action.type) {
        case "update_puzzle_list": {
            return {
                ...state,
                ...update_puzzle({ board_data: state.board_data, puzzleList: action.payload, puzzleNo: 0 }),
                puzzleList: action.payload,
            };
        }
        case "update_puzzle": {
            return { ...state, ...update_puzzle({ board_data: state.board_data, puzzleList: state.puzzleList, puzzleNo: action.payload }) };
        }
        case "update_puzzle_result": {
            const puzzleList = state.puzzleList;
            puzzleList[state.puzzleNo].solved = action.payload;
            return { ...state, puzzleList, livesLeft: state.livesLeft - Number(action.payload === false) };
        }
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
            return { ...state, game, board_data: { ...update_board({ board_data, game }), onMove: moveN, curMove: moveN }, selectedPiece: "" as "" };
        }
        case "nextMove": {
            if (state.board_data.curMove === state.board_data.onMove) return state;
            const { game } = state;
            game.move(state.puzzle?.moves[state.board_data.curMove] as string);
            return { ...state, game, board_data: { ...update_board({ board_data: state.board_data, game }), curMove: state.board_data.curMove + 1 }, wrongMove: false };
        }
        case "prevMove": {
            if (state.board_data.curMove === 0) return state;
            const { game } = state;
            game.undo();
            return { ...state, game, board_data: { ...update_board({ board_data: state.board_data, game }), curMove: state.board_data.curMove - 1 }, wrongMove: false };
        }
        // case "undoMove": {
        //     const { game } = state;
        //     game.undo();
        //     return { ...state, game, wrongMove: false, curMove: state.board_data.curMove - 1, onMove: state.board_data.onMove - 1 };
        // }
        default:
            return state;
    }
};
