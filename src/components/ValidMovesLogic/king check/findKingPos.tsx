import { boardData_Type } from "../../types";

const findKingPos = (boardData: boardData_Type): { row: number; col: number } => {
  const { turn, BoardLayout } = boardData;

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if (BoardLayout[row][col] === turn + "K") return { row, col };
    }
  }

  return { row: -1, col: -1 }; // King not found
};

export default findKingPos;