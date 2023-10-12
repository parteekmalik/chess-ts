import React from "react";
import { Chess, Move, SQUARES, Square } from "chess.js";
import { toRowCol } from "../types";

const PrevHighlight: React.FC<{ history: Move }> = ({ history }) => {
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
                style={{ transform: `translate(${from.col * 100}%, ${from.row * 100}%)` }}
            ></div>
            <div
                className="w-[12.5%] h-[12.5%] bg-no-repeat bg-[length:100%_100%] absolute bg-[rgb(255,255,51,0.5)]"
                style={{ transform: `translate(${to.col * 100}%, ${to.row * 100}%)` }}
            ></div>
        </>
    );
};

export interface HighlightProps {
    selectedPiece: { isSelected: boolean; square: Square };
    game: Chess;
}
const Highlight: React.FC<HighlightProps> = (props) => {
    const { selectedPiece, game } = props;
    const history = game.history({ verbose: true }).pop();
    const [row, col] = toRowCol(selectedPiece.square);
    return (
        <>
            {selectedPiece.isSelected && (
                <div
                    className="w-[12.5%] h-[12.5%] bg-no-repeat bg-[length:100%_100%] absolute bg-[rgb(255,255,51,0.5)]"
                    style={{ transform: `translate(${col * 100}%, ${row * 100}%)` }}
                ></div>
            )}
            {history && <PrevHighlight history={history} />}
        </>
    );
};

export default Highlight;
