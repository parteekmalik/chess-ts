// ChessBoard.tsx
import { squareSize } from "../types";
import "./piecesHints.css"

interface ChessBoardProps {
  BoardLayout: string[][];
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

      if (square !== "") {
        squares.push(
          <div
            key={position}
            className={`piece ${square}`}
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
