// ChessBoard.tsx
import { Chess, Color } from "chess.js";

interface ChessBoardProps {
    game: Chess;
    flip: Color;
}
const ChessBoard: React.FC<ChessBoardProps> = (props) => {
    const { game, flip } = props;
    const squares: JSX.Element[] = [];
    game.board().forEach((row, rowIndex) =>
        row.forEach((position, colIndex) => {
            if (position != null) {
                const Style = {
                    transform: `translate(${colIndex * 100}%, ${(flip === "w" ? rowIndex : 7 - rowIndex) * 100}%)`,
                    backgroundImage: `url(/src/assets/images/${position.color + position.type}.png)`,
                };
                squares.push(
                    <div key={position.square} className={`w-[12.5%] h-[12.5%] bg-no-repeat bg-[length:100%_100%] absolute`} id={position.square} style={Style}></div>
                );
            }
        })
    );
    return <>{squares}</>;
};
export default ChessBoard;
