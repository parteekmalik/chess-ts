import { boardData_Type } from "../../types";

const findKingPos = (boardData: boardData_Type): { row: number; col: number } => {
  const { turn, BoardLayout } = boardData;
  for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) if (turn === BoardLayout[i][j].type && BoardLayout[i][j].piece === "King") return { row: i, col: j };
  return { row: -1, col: -1 }; // Return this if the king is not found.
};

export default findKingPos;
