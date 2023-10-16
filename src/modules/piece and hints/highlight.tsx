import React from "react";
import { Chess, Color, Move, SQUARES, Square } from "chess.js";
import { toRowCol } from "../types";

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
    selectedPiece: { isSelected: boolean; square: Square };
    game: Chess;
    turn: Color;
    flip: Color;
}
const Highlight: React.FC<HighlightProps> = (props) => {
    const { selectedPiece, game, flip } = props;
    const history = game.history({ verbose: true }).pop();
    const [row, col] = toRowCol(selectedPiece.square);
    return (
        <>
            {selectedPiece.isSelected && (
                <div
                    className="w-[12.5%] h-[12.5%] bg-no-repeat bg-[length:100%_100%] absolute bg-[rgb(255,255,51,0.5)]"
                    style={{ transform: `translate(${col * 100}%, ${(flip == ("w" as Color) ? row : 7 - row) * 100}%)` }}
                ></div>
            )}
            {history && <PrevHighlight flip={flip} history={history} />}
        </>
    );
};

export default Highlight;
