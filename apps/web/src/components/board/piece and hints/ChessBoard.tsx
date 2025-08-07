// ChessBoard.tsx
import type { Color, PieceSymbol, Square } from "chess.js";

type Board = ({
  square: Square;
  type: PieceSymbol;
  color: Color;
} | null)[][];

interface ChessBoardProps {
  game: Board;
}

const ChessBoard: React.FC<ChessBoardProps> = ({ game }) => {
  return (
    <>
      {game.map((row, rowIndex) =>
        row.map((position, colIndex) => {
          if (position != null) {
            const Style: React.CSSProperties = {
              transform: `translate(${colIndex * 100}%, ${rowIndex * 100}%)`,
              backgroundImage: `url(/images/${position.color + position.type}.png)`,
            };
            return (
              <div
                key={position.square}
                className={`absolute h-[12.5%] w-[12.5%] bg-[length:100%_100%] bg-no-repeat ${position.color + position.type}`}
                id={position.square}
                style={Style}
              ></div>
            );
          }
          return null;
        }),
      )}
    </>
  );
};
export default ChessBoard;
