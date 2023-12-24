import React, { useContext, useEffect, useState } from "react";

import { Chess, Color, Square } from "chess.js";
import PuzzleContext from "../../contexts/puzzle/PuzzleContext";
import { buttonStyle } from "../../modules/Utils";
import Board from "../../modules/board/board";

interface BoardProps {}

const PuzzleBoard: React.FC<BoardProps> = (props) => {
    // const { clickHandle } = props;
    const { PuzzleState, PuzzleDispatch } = useContext(PuzzleContext);

    function clickHandle(square: Square) {
        if (PuzzleState.board_data.selectedPiece && PuzzleState.curMove === PuzzleState.onMove) {
            const from = PuzzleState.board_data.selectedPiece as Square;
            const to = square;
            PuzzleDispatch({ type: "move_piece", payload: { from, to } });
            PuzzleDispatch({ type: "update_selected_square", payload: "" });
        }
        if (PuzzleState.game.board()[8 - parseInt(square[1], 10)][square.charCodeAt(0) - "a".charCodeAt(0)])
            PuzzleDispatch({ type: "update_selected_square", payload: square });
        else PuzzleDispatch({ type: "update_selected_square", payload: "" });
    }

    return (
        <div className="flex">
            <div className="flex flex-col">
                <Board clickHandle={clickHandle} State={PuzzleState.board_data} />
                <div className="flex justify-center gap-10">
                    {/* <button
                        className={`${buttonStyle}`}
                        onClick={() => {
                            if (PuzzleState.wrongMove) PuzzleDispatch({ type: "undoMove", payload: null });
                        }}
                    >
                        retry
                    </button>
                    <button className={`${buttonStyle}`}>hint</button> */}
                    <button className={`${buttonStyle}`} onClick={() => PuzzleDispatch({ type: "prevMove", payload: null })}>
                        prev
                    </button>
                    <button className={`${buttonStyle}`} onClick={() => PuzzleDispatch({ type: "nextMove", payload: null })}>
                        next
                    </button>
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
