import React, { useContext, useEffect, useState } from "react";
import ChessBoard from "../../modules/piece and hints/ChessBoard";
import ChessBoardHints from "../../modules/piece and hints/ChessBoardHints";
import Highlight from "../../modules/piece and hints/highlight";

import { Chess, Color, Square } from "chess.js";
import { checkForValidClick } from "../../modules/types";
import Coordinates from "../../modules/coordinates/coordinates";
import PuzzleContext from "../../contexts/puzzle/PuzzleContext";
import { buttonStyle } from "../../modules/Utils";

interface BoardProps {
    clickHandle: (props: { from: Square; to: Square }) => void;
}

const PuzzleBoard: React.FC<BoardProps> = (props) => {
    const { clickHandle } = props;
    const { PuzzleState, PuzzleDispatch } = useContext(PuzzleContext);

    const PieceLogic = (event: React.MouseEvent) => {
        const { isValid, square } = checkForValidClick(event, PuzzleState.flip);
        if (!isValid) return;
        if (PuzzleState.selectedPiece && PuzzleState.game.turn() === PuzzleState.solveFor) {
            const from = PuzzleState.selectedPiece as Square;
            const to = square;
            clickHandle({ from, to });
            PuzzleDispatch({ type: "update_selected_square", payload: "" });
        }
        if (PuzzleState.game.board()[8 - parseInt(square[1], 10)][square.charCodeAt(0) - "a".charCodeAt(0)])
            PuzzleDispatch({ type: "update_selected_square", payload: square });
        else PuzzleDispatch({ type: "update_selected_square", payload: "" });
    };

    return (
        <div className="flex">
            <div className="flex flex-col">
                <div className="flex flex-col">
                    <div
                        className={` bg-[url('./assets/images/blank_board_img.png')] bg-no-repeat bg-[length:100%_100%] relative w-[500px] h-[500px]`}
                        onClick={PieceLogic}
                    >
                        <Coordinates flip={PuzzleState.flip} />
                        <Highlight selectedPiece={PuzzleState.selectedPiece} flip={PuzzleState.flip} lastMove={PuzzleState.game.history({ verbose: true }).pop()} />
                        <ChessBoard game={PuzzleState.game} flip={PuzzleState.flip} />
                        {PuzzleState.selectedPiece !== "" ? (
                            <ChessBoardHints
                                game={PuzzleState.game}
                                selectedPiece={PuzzleState.selectedPiece}
                                flip={PuzzleState.flip}
                                isShow={PuzzleState.solveFor === PuzzleState.game.turn()}
                            />
                        ) : null}
                    </div>
                </div>
                <div className="flex justify-center gap-10">
                    <button
                        className={`${buttonStyle}`}
                        onClick={() => {
                            if (PuzzleState.wrongMove) PuzzleDispatch({ type: "undo", payload: null });
                        }}
                    >
                        retry
                    </button>
                    <button className={`${buttonStyle}`}>hint</button>
                </div>
            </div>
            <div className="" id="settings-bar">
                <div
                    className={`${buttonStyle}`}
                    onClick={() => {
                        PuzzleDispatch({ type: "flip_board", payload: null });
                    }}
                >
                    flip
                </div>
                <div className={`${buttonStyle}`}>setting</div>
            </div>
        </div>
    );
};

export default PuzzleBoard;
