import { boardData_Type } from "../../types";

const findKingPos = (BoardData: boardData_Type): { row: number; col: number } => {
  const { turn, BoardLayout } = BoardData;
  let pos: { row: number; col: number } = { row: -1, col: -1 };
  for (let i: number = 0; i < 8; i++) {
    for (let j: number = 0; j < 8; j++) {
      if (turn === BoardLayout[i][j].type && BoardLayout[i][j].piece === "king") {
        pos.row = i;
        pos.col = j;
        break;
      }
    }
  }
  return pos;
};
export default findKingPos;
export { findKingPos };
