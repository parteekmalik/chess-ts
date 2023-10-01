// import React from "react";
// import { squareSize, MovesPlayed_Type } from "../types";

// export interface HighlightProps {
//   selectedPiece: { isSelected: boolean; row: number; col: number };
// }

// const PrevHighlight: React.FC<MovesPlayed_Type> = ({ current, moves }) => {
//   if (current > -1) {
//     const move = moves[current];
//     let from: { row: number; col: number; piece: string } = move.from;
//     let to: { row: number; col: number; piece: string } = move.to;

//     return (
//       <>
//         <div className="highlight" style={{ transform: `translate(${from.col * squareSize}px, ${from.row * squareSize}px)` }}></div>
//         <div className="highlight" style={{ transform: `translate(${to.col * squareSize}px, ${to.row * squareSize}px)` }}></div>
//       </>
//     );
//   }
//   return null;
// };

// const Highlight: React.FC<HighlightProps> = ({ selectedPiece, movesPlayed }) => {
//   return (
//     <>
//       {selectedPiece.isSelected && (
//         <div className="highlight" style={{ transform: `translate(${selectedPiece.col * squareSize}px, ${selectedPiece.row * squareSize}px)` }}></div>
//       )}
//       <PrevHighlight current={movesPlayed.current} moves={movesPlayed.moves} />
//     </>
//   );
// };

// export default Highlight;
export {};