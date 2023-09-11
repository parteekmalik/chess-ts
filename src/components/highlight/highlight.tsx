import { MovesPlayedType } from "../types";
import { squareSize } from "../types";
export interface highlightProps {
  selectedPiece: { isSelected: boolean; row: number; col: number };
  movesPlayed: MovesPlayedType;
}

const Highlight: React.FC<highlightProps> = (props) => {
  const { selectedPiece, movesPlayed } = props;
  return (
    <>
      {selectedPiece.isSelected && <div className="highlight" style={{ transform: `translate(${selectedPiece.col * squareSize}px, ${selectedPiece.row * squareSize}px)` }}></div>}
      {movesPlayed.current > -1 && (
        <>
          <div
            className="highlight"
            style={{ transform: `translate(${movesPlayed.moves[movesPlayed.current].from.col * squareSize}px, ${movesPlayed.moves[movesPlayed.current].from.row * squareSize}px)` }}
          ></div>
          <div
            className="highlight"
            style={{ transform: `translate(${movesPlayed.moves[movesPlayed.current].to.col * squareSize}px, ${movesPlayed.moves[movesPlayed.current].to.row * squareSize}px)` }}
          ></div>
        </>
      )}
    </>
  );
};
export default Highlight;
