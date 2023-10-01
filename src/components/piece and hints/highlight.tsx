import React from "react";
import { squareSize } from "../types";
import { Chess, Move, SQUARES, Square } from "chess.js";
import { toRowCol } from "../toRow_col";

const PrevHighlight: React.FC<{ history: Move }> = ({ history }) => {
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
      <div className="highlight" style={{ transform: `translate(${from.col * squareSize}px, ${from.row * squareSize}px)` }}></div>
      <div className="highlight" style={{ transform: `translate(${to.col * squareSize}px, ${to.row * squareSize}px)` }}></div>
    </>
  );
};

export interface HighlightProps {
  selectedPiece: { isSelected: boolean; square: Square };
  game: Chess;
}
const Highlight: React.FC<HighlightProps> = (props) => {
  const { selectedPiece, game } = props;
  const history = game.history({ verbose: true }).pop();
  const [row, col] = toRowCol(selectedPiece.square);
  return (
    <>
      {selectedPiece.isSelected && <div className="highlight" style={{ transform: `translate(${col * squareSize}px, ${row * squareSize}px)` }}></div>}
      {history && <PrevHighlight history={history} />}
    </>
  );
};

export default Highlight;
