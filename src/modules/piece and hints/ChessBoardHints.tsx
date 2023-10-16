// ChessBoardHints.tsx
import { Square, Chess, Color } from "chess.js";
import { selectedPieceProps } from "../types";
import { toRowCol } from "../types";

interface ChessBoardProps {
    selectedPiece: selectedPieceProps;
    game: Chess;
    turn: Color;
    flip: Color;
}
const ChessBoardHints: React.FC<ChessBoardProps> = (props) => {
    const { selectedPiece, game, turn,flip } = props;
    const BoardLayout = game.board();
    
    const squares: JSX.Element[] = [];
    if(turn != game.turn())return squares;
    
    if (selectedPiece.isSelected) {
        game.moves({ verbose: true, square: selectedPiece.square })
            .map((move) => ({ from: move.from as Square, to: move.to as Square, promotion: move.promotion }))
            .forEach((square) => {
                const [rowIndex, colIndex] = toRowCol(square.to);
                const Style = {
                    transform: `translate(${colIndex * 100}%, ${(flip == ("b" as Color) ? 7 - rowIndex : rowIndex) * 100}%)`,
                };
                if (BoardLayout[rowIndex][colIndex])
                    squares.push(
                        <div
                            key={"hint" + square.to + square.promotion}
                            className={`w-[12.5%] h-[12.5%] bg-no-repeat bg-[length:100%_100%] absolute bg-clip-content box-border rounded-[50%] border-solid border-[rgba(0,0,0,0.1)] border-[10px]`}
                            id={square.to + square.promotion}
                            style={Style}
                        ></div>
                    );
                else
                    squares.push(
                        <div
                            key={"hint" + square.to + square.promotion}
                            className={`bg-[rgba(0,0,0,0.1)] p-[4.2%] w-[12.5%] h-[12.5%] bg-no-repeat bg-[length:100%_100%] absolute bg-clip-content box-border rounded-[50%]`}
                            id={square.to + square.promotion}
                            style={Style}
                        ></div>
                    );
            });
    }

    return <>{squares}</>;
};
export default ChessBoardHints;
