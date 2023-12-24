import React, { useContext } from "react";
import { Chess, Color, Move, SQUARES, Square } from "chess.js";
import { toRowCol } from "../types";
import SocketContext from "../../contexts/socket/SocketContext";

const PrevHighlight: React.FC<{ history: Move; flip: Color }> = ({ history, flip }) => {
    const from = {
        row: Math.floor(SQUARES.indexOf(history.to) / 8),
        col: SQUARES.indexOf(history.to) % 8,
    };
    const to = {
        row: Math.floor(SQUARES.indexOf(history.from) / 8),
        col: SQUARES.indexOf(history.from) % 8,
    };

    return (
        <>
            <div
                className="w-[12.5%] h-[12.5%] bg-no-repeat bg-[length:100%_100%] absolute bg-[rgb(255,255,51,0.5)]"
                style={{ transform: `translate(${from.col * 100}%, ${(flip == "w" ? from.row : 7 - from.row) * 100}%)` }}
            ></div>
            <div
                className="w-[12.5%] h-[12.5%] bg-no-repeat bg-[length:100%_100%] absolute bg-[rgb(255,255,51,0.5)]"
                style={{ transform: `translate(${to.col * 100}%, ${(flip == "w" ? to.row : 7 - to.row) * 100}%)` }}
            ></div>
        </>
    );
};

export interface HighlightProps {
    selectedPiece: Square | "";
    lastMove: Move | undefined;
    flip: Color;
}
const Highlight: React.FC<HighlightProps> = (props) => {
    const { selectedPiece, lastMove, flip } = props;

    const { row, col } = toRowCol(selectedPiece as Square);
    return (
        <>
            {selectedPiece && (
                <div
                    className="w-[12.5%] h-[12.5%] bg-no-repeat bg-[length:100%_100%] absolute bg-[rgb(255,255,51,0.5)]"
                    style={{ transform: `translate(${col * 100}%, ${(flip === "w" ? row : 7 - row) * 100}%)` }}
                ></div>
            )}
            {lastMove && <PrevHighlight flip={flip} history={lastMove} />}
        </>
    );
};

export default Highlight;
