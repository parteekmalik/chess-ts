import React from "react";
import { squareSize } from "../types";
import { Chess, Move, SQUARES } from "chess.js";

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
  selectedPiece: { isSelected: boolean; row: number; col: number };
  game: Chess;
}
const Highlight: React.FC<HighlightProps> = (props) => {
  const { selectedPiece, game } = props;
  const history = game.history({ verbose: true }).pop();
  return (
    <>
      {selectedPiece.isSelected && (
        <div className="highlight" style={{ transform: `translate(${selectedPiece.col * squareSize}px, ${selectedPiece.row * squareSize}px)` }}></div>
      )}
      {history && <PrevHighlight history={history} />}
    </>
  );
};

export default Highlight;
