import { Chess } from "chess.js";
import { ChessMoveType } from "~/modules/board/boardMain";
import { defaultPuzzleContextState, IPuzzleContextState, Puzzle } from "./PuzzleContext";

export type IPuzzleContextActions =
  | { type: "update_puzzle_list"; payload: Puzzle[] }
  | { type: "update_puzzle"; payload: number }
  | { type: "update_puzzle_result"; payload: boolean }
  | { type: "move_piece"; payload: ChessMoveType };

function nextPuzzle(state: IPuzzleContextState, puzzleno?: number): Pick<IPuzzleContextState, "movesPlayed" | "puzzleNo" | "playerTurn"> {
  const puzzle = state.puzzleList[(puzzleno ?? state.puzzleNo) + 1] as Puzzle;
  console.log("puzzle -> ", puzzle, puzzleno, state.puzzleNo);
  const game = new Chess(puzzle.fen);
  game.move(puzzle.moves[0] as string);
  return {
    movesPlayed: game.history(),
    playerTurn: game.turn(),
    puzzleNo: (puzzleno ?? state.puzzleNo) + 1,
  };
}

export const PuzzleReducer = (state: IPuzzleContextState, action: IPuzzleContextActions): IPuzzleContextState => {
  // console.log("Update State - Action: " + action.type + " - Payload: ", action.payload);
  switch (action.type) {
    case "update_puzzle_list": {
      const newState = { ...defaultPuzzleContextState, puzzleList: action.payload };
      return { ...newState, ...nextPuzzle(newState, -1) };
    }
    case "move_piece": {
      const puzzle = state.puzzleList[state.puzzleNo];
      if (!puzzle) return state;

      const game = new Chess(puzzle.fen);
      const newState = { ...state };

      try {
        state.movesPlayed.forEach((move) => {
          game.move(move);
        });
        game.move(action.payload);
        newState.movesPlayed = game.history();

        if (
          puzzle.moves.length === newState.movesPlayed.length &&
          puzzle.moves[puzzle.moves.length - 1] === game.history()[game.history().length - 1]
        ) {
          newState.passedPuzzleList[state.puzzleNo] = true;
          console.log("completed Puzzle");
          return { ...newState, ...nextPuzzle(newState) };
        } else if (puzzle.moves[game.history().length - 1] !== game.history()[game.history().length - 1]) {
          newState.passedPuzzleList[state.puzzleNo] = false;
          newState.livesLeft = state.livesLeft - 1;
          console.log("wrong move");
          return { ...newState, ...nextPuzzle(newState) };
        }

        // playing automatically for robot if the puzzle is not solved by user
        if (puzzle.moves.length !== newState.movesPlayed.length) {
          game.move(puzzle.moves[newState.movesPlayed.length] as string);
          newState.movesPlayed = game.history();
        }
      } catch {
        console.log("move not possible");
        return state;
      }

      return newState;
    }
    default:
      return state;
  }
};
