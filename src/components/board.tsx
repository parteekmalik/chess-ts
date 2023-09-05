import ChessBoard from "./ChessBoard";
import { HtmlHTMLAttributes, useState } from "react";
import "./board.css";
import findValidMoves from "./findValidMoves";

const initialPoition: {type:string;piece:string}[][] = [
  [
    { type: "black", piece: "rook" },
    { type: "black", piece: "knight" },
    { type: "black", piece: "bishop" },
    { type: "black", piece: "king" },
    { type: "black", piece: "queen" },
    { type: "black", piece: "bishop" },
    { type: "black", piece: "knight" },
    { type: "black", piece: "rook" },
  ],
  [
    { type: "black", piece: "pawn" },
    { type: "black", piece: "pawn" },
    { type: "black", piece: "pawn" },
    { type: "black", piece: "pawn" },
    { type: "black", piece: "pawn" },
    { type: "black", piece: "pawn" },
    { type: "black", piece: "pawn" },
    { type: "black", piece: "pawn" },
  ],
  Array(8).fill({ type: "empty", piece: "" }),
  Array(8).fill({ type: "empty", piece: "" }),
  Array(8).fill({ type: "empty", piece: "" }),
  Array(8).fill({ type: "empty", piece: "" }),
  [
    { type: "white", piece: "pawn" },
    { type: "white", piece: "pawn" },
    { type: "white", piece: "pawn" },
    { type: "white", piece: "pawn" },
    { type: "white", piece: "pawn" },
    { type: "white", piece: "pawn" },
    { type: "white", piece: "pawn" },
    { type: "white", piece: "pawn" },
  ],
  [
    { type: "white", piece: "rook" },
    { type: "white", piece: "knight" },
    { type: "white", piece: "bishop" },
    { type: "white", piece: "king" },
    { type: "white", piece: "queen" },
    { type: "white", piece: "bishop" },
    { type: "white", piece: "knight" },
    { type: "white", piece: "rook" },
  ],
];
const pieceSize: number = 50;

const checkForValidClick = (event: React.MouseEvent) => {
  const { clientX, clientY, currentTarget } = event;
  const { left, top, right, bottom } = currentTarget.getBoundingClientRect();

  // Check if the click is within the boundaries of the target element
  const isValid = clientX >= left && clientX <= right && clientY >= top && clientY <= bottom;

  const col = isValid ? Math.floor((clientX - left) / pieceSize) : -1;
  const row = isValid ? Math.floor((clientY - top) / pieceSize) : -1;

  return { isValid, row, col };
};

// const makeMove = () => {

// }

function Board() {
  const [BoardLayout, setBoardLayout] = useState<{type:string;piece:string}[][]>(initialPoition);
  const [turn, setTurn] = useState<string>("white");
  const [Hints, setHints] = useState<{ row: number; col: number }[]>([]);
  const [SelectedPiece, setSelectedPiece] = useState<{
    isSelected: boolean;
    row: number;
    col: number;
  }>({ isSelected: false, row: 0, col: 0 });

  // still working on findValidMoves
  // let ValidMoves: { row: number; col: number }[][][] = findValidMoves({BoardLayout,turn});
  // console.log(ValidMoves);

  const ClickHandle = (event: React.MouseEvent) => {
    const { isValid, row, col } = checkForValidClick(event);
    console.log(checkForValidClick(event));

    if (isValid) {
      if (!SelectedPiece.isSelected) {
        setSelectedPiece({ isSelected: true, row: row, col: col });
        // setHints(ValidMoves[row][col]);
      } else {
        if (Hints.some((hint) => hint.row === row && hint.col === col)) {
          // makeMove();
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
