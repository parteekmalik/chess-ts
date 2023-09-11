// ChessBoardHints.tsx
import { squareSize } from "../types";

interface ChessBoardProps {
  Hints: { isShowHint: boolean; hints: { row: number; col: number }[] };
  BoardLayout: { type: string; piece: string }[][];
}
const ChessBoardHints: React.FC<ChessBoardProps> = (props) => {
  const { Hints, BoardLayout } = props;
  const { hints } = Hints;
  const squares: JSX.Element[] = [];
  hints.forEach((square) => {
    const rowIndex = square.row;
    const colIndex = square.col;
    const position = `${rowIndex},${colIndex}`;
    const Style = {
      transform: `translate(${colIndex * squareSize}px, ${rowIndex * squareSize}px)`,
    };
    if (BoardLayout[rowIndex][colIndex].type !== "empty") squares.push(<div key={"hint" + position} className={`hint-capture`} id={position} style={Style}></div>);
    else squares.push(<div key={"hint" + position} className={`hint`} id={position} style={Style}></div>);
  });

  return <>{squares}</>;
};
export default ChessBoardHints;
