import ChessBoard from "./ChessBoard";
import { HtmlHTMLAttributes, useState } from "react";
import "./board.css";

const initialPoition: string[][] = [
  ["bRk", "bKt", "bBp", "bKg", "bQn", "bBp", "bKt", "bRk"],
  ["bPn", "bPn", "bPn", "bPn", "bPn", "bPn", "bPn", "bPn"],
  Array(8).fill(""),
  Array(8).fill(""),
  Array(8).fill(""),
  Array(8).fill(""),
  ["wPn", "wPn", "wPn", "wPn", "wPn", "wPn", "wPn", "wPn"],
  ["wRk", "wKt", "wBp", "wKg", "wQn", "wBp", "wKt", "wRk"],
];
const pieceSize: number = 50;

const checkForValidClick = (event: React.MouseEvent) => {
  const { clientX, clientY, currentTarget } = event;
  const { left, top, right, bottom } = currentTarget.getBoundingClientRect();

  // Check if the click is within the boundaries of the target element
  const isValid =
    clientX >= left && clientX <= right && clientY >= top && clientY <= bottom;

  const col = isValid ? Math.floor((clientX - left) / pieceSize) : -1;
  const row = isValid ? Math.floor((clientY - top) / pieceSize) : -1;

  return { isValid, row, col };
};
let ValidMoves: { row: number; col: number }[][][] = [[]];

const makeMove = () => {
    
}

function Board() {
  const [BoardLayout, setBoardLayout] = useState<string[][]>(initialPoition);
  const [Hints, setHints] = useState<{ row: number; col: number }[]>([]);
  const [SelectedPiece, setSelectedPiece] = useState<{
    isSelected: boolean;
    row: number;
    col: number;
  }>({ isSelected: false, row: 0, col: 0 });

  const ClickHandle = (event: React.MouseEvent) => {
    const { isValid, row, col } = checkForValidClick(event);
    console.log(checkForValidClick(event));

    if (isValid) {
      if (!SelectedPiece.isSelected) {
        setSelectedPiece({ isSelected: true, row: row, col: col });
        setHints(ValidMoves[row][col]);
      } else {
        if (Hints.some((hint) => hint.row === row && hint.col === col)) {
            makeMove();
        } else {
          setSelectedPiece({ ...SelectedPiece, isSelected: false });
        }
      }
    } else {
      setSelectedPiece({ ...SelectedPiece, isSelected: false });
    }
  };

  return (
    <div className="chess-board" onClick={ClickHandle}>
      <ChessBoard BoardLayout={BoardLayout} />
    </div>
  );
}

export default Board;
