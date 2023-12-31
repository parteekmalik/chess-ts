import React, { useContext } from "react";
import Coordinates from "./coordinates/coordinates";
import PuzzleContext, { IPuzzleContextState } from "../../contexts/puzzle/PuzzleContext";
import { Chess, Color, Move, Square } from "chess.js";
import Highlight from "./piece and hints/highlight";
import ChessBoard from "./piece and hints/ChessBoard";
import ChessBoardHints from "./piece and hints/ChessBoardHints";
import { checkForValidClick } from "../Utils";
interface BoardProps {
    clickHandle: (square: Square) => void;
    State: Tboard_data;
}
export type Tboard_data = {
    board_layout: string;
    flip: Color;
    selectedPiece: Square | "";
    lastMove: Move | undefined;
    solveFor: Color;
    curMove: number;
    onMove: number;
    whiteTime?: number;
    blackTime?: number;
};
const ComBoard: React.FC<BoardProps> = (props) => {
    const { State, clickHandle } = props;
    const game = new Chess(State.board_layout);

    const PieceLogic = (event: React.MouseEvent) => {
        const { isValid, square } = checkForValidClick(event, State.flip);
        if (!isValid) return;
        clickHandle(square);
    };

    return (
        <div className="flex flex-col">
            <div className={` bg-[url('./assets/images/blank_board_img.png')] bg-no-repeat bg-[length:100%_100%] relative w-[500px] h-[500px]`} onClick={PieceLogic}>
                <Coordinates flip={State.flip} />
                <Highlight selectedPiece={State.selectedPiece} flip={State.flip} lastMove={State.lastMove} />
                <ChessBoard game={game} flip={State.flip} />
                {State.selectedPiece !== "" && State.curMove === State.onMove && State.solveFor === game.turn() ? (
                    <ChessBoardHints game={game} selectedPiece={State.selectedPiece} flip={State.flip} />
                ) : null}
            </div>
        </div>
    );
};

export default ComBoard;
