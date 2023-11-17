// ChessBoardHints.tsx
import { Square, Chess, Color } from "chess.js";
import { selectedPieceProps } from "../types";
import { toRowCol } from "../types";
import { useContext } from "react";
import SocketContext from "../../contexts/socket/SocketContext";
import PageContext from "../../contexts/page/PageContext";

interface ChessBoardProps {}
const ChessBoardHints: React.FC<ChessBoardProps> = (props) => {
    const { game, selectedPiece, whitePlayerId, blackPlayerId } = useContext(SocketContext).SocketState;
    const { uid } = useContext(PageContext).PageState;
    const { flip } = useContext(SocketContext).SocketState;

    const BoardLayout = game.board();

    const squares: JSX.Element[] = [];
    if (uid !== (game.turn() === "w" ? whitePlayerId : blackPlayerId)) return squares;

    if (selectedPiece) {
        game.moves({ verbose: true, square: selectedPiece })
            .map((move) => ({ from: move.from as Square, to: move.to as Square, promotion: move.promotion }))
            .forEach((square) => {
                const {row, col} = toRowCol(square.to);
                const Style = {
                    transform: `translate(${col * 100}%, ${(flip === "b" ? 7 - row : row) * 100}%)`,
                };
                if (BoardLayout[row][col])
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
