import ChessBoard from "./ChessBoard";
import ChessBoardHints from "./ChessBoardHints";
import { HtmlHTMLAttributes, useState } from "react";
import "./board.css";
import findValidMoves from "./findValidMoves";
import { initialPoition } from "./types";


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

const makeMove = () => {

}

function Board() {
  const [BoardData, setBoardData] = useState<{ BoardLayout: { type: string; piece: string }[][]; turn: string; ValidMoves: { row: number; col: number }[][][] }>
  ({ BoardLayout: initialPoition, turn: "white", ValidMoves: findValidMoves({ BoardLayout: initialPoition, turn: "white" }) });
  const [Hints, setHints] = useState<{ isShowHint: boolean; hints: { row: number; col: number }[] }>({ isShowHint: true, hints: [] });
  const [SelectedPiece, setSelectedPiece] = useState<{ isSelected: boolean; row: number; col: number }>({ isSelected: false, row: 0, col: 0 });

  // still working on findValidMoves remaining : casling, en passent;
  // let ValidMoves: { row: number; col: number }[][][] = findValidMoves({ BoardLayout: BoardData.BoardLayout, turn:BoardData.turn });

  const ClickHandle = (event: React.MouseEvent) => {
    const { isValid, row, col } = checkForValidClick(event);
    console.log(checkForValidClick(event));

    // logic not correct select accourding to turn
    if (isValid) {
      if (!SelectedPiece.isSelected) {
        setSelectedPiece({ isSelected: true, row: row, col: col });
        setHints({...Hints,hints: BoardData.ValidMoves[row][col]});
      } else {
        if (Hints.hints.some((hint) => hint.row === row && hint.col === col)) {
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
      <ChessBoard BoardLayout={BoardData.BoardLayout} />
      <ChessBoardHints Hints={Hints} />
    </div>
  );
}

export default Board;
