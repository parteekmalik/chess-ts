// ChessBoardHints.tsx
import type { Chess, Color, Square } from "chess.js";
import type { JSX } from "react";

import { toRowCol } from "../../Utils";

interface ChessBoardProps {
  flip: Color;
  selectedPiece: Square | "";
  game: Chess;
}
const ChessBoardHints: React.FC<ChessBoardProps> = (props) => {
  const { flip, selectedPiece, game } = props;
  const BoardLayout = game.board();

  const squares: JSX.Element[] = [];

  if (selectedPiece !== "") {
    game
      .moves({ verbose: true, square: selectedPiece })
      .map((move) => ({ from: move.from, to: move.to, promotion: move.promotion }))
      .forEach((square) => {
        const { row, col } = toRowCol(square.to);
        const Style = {
          transform: `translate(${col * 100}%, ${(flip === "b" ? 7 - row : row) * 100}%)`,
        };
        if (BoardLayout[row]?.[col])
          squares.push(
            <div
              key={"hint" + square.to + square.promotion}
              className={`absolute box-border h-[12.5%] w-[12.5%] rounded-[50%] border-[10px] border-solid border-[rgba(0,0,0,0.1)] bg-[length:100%_100%] bg-clip-content bg-no-repeat`}
              id={square.to + square.promotion}
              style={Style}
            ></div>,
          );
        else
          squares.push(
            <div
              key={"hint" + square.to + square.promotion}
              className={`absolute box-border h-[12.5%] w-[12.5%] rounded-[50%] bg-[rgba(0,0,0,0.1)] bg-[length:100%_100%] bg-clip-content bg-no-repeat p-[4.2%]`}
              id={square.to + square.promotion}
              style={Style}
            ></div>,
          );
      });
  }

  return <>{squares}</>;
};
export default ChessBoardHints;
