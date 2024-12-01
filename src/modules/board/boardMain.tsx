import React from "react";

import { Square } from "chess.js";
import { IPuzzleContextState } from "~/app/puzzle/_components/PuzzleContext";
import { buttonStyle } from "../Utils";
import ComBoard from "./board";

export type ChessMoveType =
  | string
  | {
      from: string;
      to: string;
      promotion?: string;
    };

interface BoardProps {
  State: IPuzzleContextState;
  playedMove: (move: ChessMoveType) => void;
}
const checkTurnLogic = (State: IPuzzleContextState): boolean => {
  switch (State.type) {
    case "puzzle":
      return (
        State.board_data.selectedPiece !== "" &&
        State.board_data.curMove === State.board_data.onMove &&
        State.board_data.solveFor === State.game.turn()
      );
    default:
      return false;
  }
};

const Board: React.FC<BoardProps> = (props) => {
  const { State, playedMove } = props;

  //   function isSquareEmpty(square: Square) {
  //     return !State.game.board()[8 - parseInt(square[1], 10)][square.charCodeAt(0) - "a".charCodeAt(0)];
  //   }

  function clickHandle(square: Square) {
    if (checkTurnLogic(State)) {
      const from = State.board_data.selectedPiece as Square;
      const to = square;
      playedMove({ from, to });
    }
    // if (!isSquareEmpty(square)) StateDispatch({ type: "update_selected_square", payload: square });
    // else StateDispatch({ type: "update_selected_square", payload: "" });
  }

  return (
    <div className="flex">
      <div className="flex flex-col">
        {/* {State.type === "live" ? (
          <Banner
            data={
              State.board_data.flip === "w"
                ? { name: State.match_details?.blackId, time: State.board_data.blackTime }
                : { name: State.match_details?.whiteId, time: State.board_data.whiteTime }
            }
          />
        ) : null} */}
        <ComBoard State={State.board_data} clickHandle={clickHandle} />
        {/* {State.type === "live" ? (
          <Banner
            data={
              State.board_data.flip === "w"
                ? { name: State.match_details?.whiteId, time: State.board_data.whiteTime }
                : { name: State.match_details?.blackId, time: State.board_data.blackTime }
            }
          />
        ) : null} */}
        {/* <div className="flex justify-center gap-10">
          <button className={`${buttonStyle}`} onClick={() => StateDispatch({ type: "prevMove", payload: null })}>
            prev
          </button>
          <button className={`${buttonStyle}`} onClick={() => StateDispatch({ type: "nextMove", payload: null })}>
            next
          </button>
        </div> */}
      </div>
      <div className="" id="settings-bar">
        {/* <div
          className={`${buttonStyle}`}
          onClick={() => {
            StateDispatch({ type: "flip_board", payload: null });
          }}
        >
          flip
        </div> */}
        <div className={`${buttonStyle}`}>setting</div>
      </div>
    </div>
  );
};

export default Board;
