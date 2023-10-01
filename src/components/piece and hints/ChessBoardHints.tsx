// ChessBoardHints.tsx
import { SQUARES, Square, PieceSymbol, Chess } from "chess.js";
import { squareSize, HintsProps, selectedPieceProps } from "../types";

// Hints: {from:Square,to:Square,promotion: PieceSymbol | undefined}[];
// BoardLayout: ({ square: string; type: string; color: string } | null)[][];
interface ChessBoardProps {
  selectedPiece: selectedPieceProps;
  game: Chess;
}
const ChessBoardHints: React.FC<ChessBoardProps> = (props) => {
  const { selectedPiece, game } = props;
  const BoardLayout = game.board();

  const squares: JSX.Element[] = [];
  if (selectedPiece.isSelected) {
    game
      .moves({ verbose: true, square: SQUARES[selectedPiece.row * 8 + selectedPiece.col] })
      .map((move) => ({ from: move.from as Square, to: move.to as Square, promotion: move.promotion }))
      .forEach((square) => {
        const rowIndex = Math.floor(SQUARES.indexOf(square.to) / 8);
        const colIndex = SQUARES.indexOf(square.to) % 8;
        const Style = {
          transform: `translate(${colIndex * squareSize}px, ${rowIndex * squareSize}px)`,
        };
        if (BoardLayout[rowIndex][colIndex])
          squares.push(<div key={"hint" + square.to + square.promotion} className={`hint-capture`} id={square.to + square.promotion} style={Style}></div>);
        else squares.push(<div key={"hint" + square.to + square.promotion} className={`hint`} id={square.to + square.promotion} style={Style}></div>);
      });
  }

  return <>{squares}</>;
};
export default ChessBoardHints;
