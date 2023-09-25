// ChessBoard.tsx
import { squareSize } from "../types";

interface ChessBoardProps {
  BoardLayout: { type: string; piece: string }[][];
}
const ChessBoard: React.FC<ChessBoardProps> = (props) => {
  const { BoardLayout } = props;
  const squares: JSX.Element[] = [];
  BoardLayout.forEach((row, rowIndex) =>
    row.forEach((square, colIndex) => {
      const position = `${rowIndex},${colIndex}`;
      const Style = {
        transform: `translate(${colIndex * squareSize}px, ${rowIndex * squareSize}px)`,
      };

      if (square.type !== "empty") {
        squares.push(
          <div
            key={position}
            className={`piece ${square.type[0] + square.piece[0].toUpperCase() + square.piece[square.piece.length - 1]}`}
            id={position}
            style={Style}
          ></div>
        );
      }
    })
  );
  return <>{squares}</>;
};
export default ChessBoard;
