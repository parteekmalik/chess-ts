// ChessBoardHints.tsx
import { squareSize, moves_Type } from "../types";

interface ChessBoardProps {
  Hints: moves_Type[];
  BoardLayout: string[][];
}
const ChessBoardHints: React.FC<ChessBoardProps> = (props) => {
  const { Hints, BoardLayout } = props;
  const squares: JSX.Element[] = [];
  Hints.forEach((square) => {
    const rowIndex = square.row;
    const colIndex = square.col;
    const position = `${rowIndex},${colIndex}`;
    const Style = {
      transform: `translate(${colIndex * squareSize}px, ${rowIndex * squareSize}px)`,
    };
    if (BoardLayout[rowIndex][colIndex] !== "") squares.push(<div key={"hint" + position} className={`hint-capture`} id={position} style={Style}></div>);
    else squares.push(<div key={"hint" + position} className={`hint`} id={position} style={Style}></div>);
  });

  return <>{squares}</>;
};
export default ChessBoardHints;
