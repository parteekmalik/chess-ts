// ChessBoard.tsx
import { squareSize } from "../types";
import "./piecesHints.css" 

interface ChessBoardProps {
  BoardLayout: ({ square: string; type: string; color: string; } | null)[][];
}
const ChessBoard: React.FC<ChessBoardProps> = (props) => {
  const { BoardLayout } = props;
  const squares: JSX.Element[] = [];
  BoardLayout.forEach((row, rowIndex) =>
    row.forEach((position, colIndex) => {
      const Style = {
        transform: `translate(${colIndex * squareSize}px, ${rowIndex * squareSize}px)`,
      };

      if (position) {
        squares.push(
          <div
            key={position.square}
            className={`piece ${position.color + position.type}`}
            id={position.square}
            style={Style}
          ></div>
        );
      }
    })
  );
  return <>{squares}</>;
};
export default ChessBoard;
