import { Color, Move, SQUARES, Square } from "chess.js";
import React from "react";
import { toRowCol } from "../../Utils";

const PrevHighlight: React.FC<{ history: Pick<Move, "from" | "to">; flip: Color }> = ({ history, flip }) => {
  const from = {
    row: Math.floor(SQUARES.indexOf(history.to) / 8),
    col: SQUARES.indexOf(history.to) % 8,
  };
  const to = {
    row: Math.floor(SQUARES.indexOf(history.from) / 8),
    col: SQUARES.indexOf(history.from) % 8,
  };

  return (
    <>
      <div
        className="absolute h-[12.5%] w-[12.5%] bg-[rgb(255,255,51,0.5)] bg-[length:100%_100%] bg-no-repeat"
        style={{ transform: `translate(${from.col * 100}%, ${(flip == "w" ? from.row : 7 - from.row) * 100}%)` }}
      ></div>
      <div
        className="absolute h-[12.5%] w-[12.5%] bg-[rgb(255,255,51,0.5)] bg-[length:100%_100%] bg-no-repeat"
        style={{ transform: `translate(${to.col * 100}%, ${(flip == "w" ? to.row : 7 - to.row) * 100}%)` }}
      ></div>
    </>
  );
};

export interface HighlightProps {
  selectedPiece?: Square | null;
  lastMove?: Pick<Move, "from" | "to">;
  flip: Color;
}
const Highlight: React.FC<HighlightProps> = (props) => {
  const { selectedPiece, lastMove, flip } = props;

  const { row, col } = toRowCol(selectedPiece as Square);
  return (
    <>
      {selectedPiece && (
        <div
          className="absolute h-[12.5%] w-[12.5%] bg-[rgb(255,255,51,0.5)] bg-[length:100%_100%] bg-no-repeat"
          style={{ transform: `translate(${col * 100}%, ${(flip === "w" ? row : 7 - row) * 100}%)` }}
        ></div>
      )}
      {lastMove && <PrevHighlight flip={flip} history={lastMove} />}
    </>
  );
};

export default Highlight;
