// ChessBoardHints.tsx
import { SQUARES, Square, PieceSymbol } from "chess.js";
import { squareSize } from "../types";

interface ChessBoardProps {
  Hints: {from:Square,to:Square,promotion: PieceSymbol | undefined}[];
  BoardLayout: ({ square: string; type: string; color: string } | null)[][];
}
const ChessBoardHints: React.FC<ChessBoardProps> = (props) => {
  const { Hints, BoardLayout } = props;
  const squares: JSX.Element[] = [];
  Hints.forEach((square) => {
    const rowIndex = Math.floor(SQUARES.indexOf(square.to) / 8);
    const colIndex = SQUARES.indexOf(square.to)%8;
    const Style = {
      transform: `translate(${colIndex * squareSize}px, ${rowIndex * squareSize}px)`,
    };
    if (BoardLayout[rowIndex][colIndex]) squares.push(<div key={"hint" + square.to+square.promotion} className={`hint-capture`} id={square.to+square.promotion} style={Style}></div>);
    else squares.push(<div key={"hint" + square.to+square.promotion} className={`hint`} id={square.to+square.promotion} style={Style}></div>);
  });

  return <>{squares}</>;
};
export default ChessBoardHints;
