import React, { useContext, useEffect, useState } from "react";

import { Chess, Color, Square } from "chess.js";
import { ISocketContextState } from "../../contexts/socket/SocketContext";
import { IPuzzleContextState } from "../../contexts/puzzle/PuzzleContext";
import { ISocketContextActions } from "../../contexts/socket/SocketReducer";
import { IPuzzleContextActions } from "../../contexts/puzzle/PuzzleReducer";
import PageContext from "../../contexts/page/PageContext";
import Banner from "./banner/banner";
import ComBoard from "./board";
import { buttonStyle } from "../Utils";

// export interface ISocketContextState {
//     socket: Socket | undefined;
//     game: Chess;
//     match_details: {
//         blackPlayerId: string;
//         whitePlayerId: string;
//         matchid: string;
//         game_stats: string;
//         gameType: {
//             baseTime: number;
//             incrementTime: number;
//         };
//     };

//     match_prev_details: {
//         board_moves_layout: string[];
//         movesTime: number[];
//         movesUndone: string[];
//     };
//     board_data: Tboard_data;
//     type: string;
//     SocketEmiter: (type: string, payload: any) => void;
// }
// export type Tpuzzle = {
//     id: number;
//     fen: string;
//     moves: string[];
//     opening_tags: string[];
//     rating: number;
//     rating_deviation: number;
//     themes: string[];
//     solved: boolean;
// };

// export interface IPuzzleContextState {
//     puzzleList: Tpuzzle[];
//     puzzle: Tpuzzle | null;
//     puzzleNo: number;
//     game: Chess;
//     wrongMove: boolean;
//     livesLeft: number;
//     curMove: number;
//     onMove: number;
//     board_data: Tboard_data;
//     type: string;
// }
// export type Tboard_data = {
//     board_layout: string;
//     flip: Color;
//     selectedPiece: Square | "";
//     lastMove: Move | undefined;
//     solveFor: Color;
//     whiteTime?: number;
//     blackTime?: number;
// };
interface BoardProps {
    State: ISocketContextState | IPuzzleContextState;
    StateDispatch: React.Dispatch<ISocketContextActions> | React.Dispatch<IPuzzleContextActions>;
}
const checkTurnLogic = (State: ISocketContextState | IPuzzleContextState): boolean => {
    switch (State.type) {
        case "live":
            return State.board_data.selectedPiece !== "" && State.board_data.curMove === State.board_data.onMove && State.board_data.solveFor === State.game.turn();
        case "puzzle":
            return State.board_data.selectedPiece !== "" && State.board_data.curMove === State.board_data.onMove && State.board_data.solveFor === State.game.turn();
        default:
            return false;
    }
};

const Board: React.FC<BoardProps> = (props) => {
    const { State, StateDispatch } = props;
    const { uid } = useContext(PageContext).PageState;

    function isSquareEmpty(square: Square) {
        return !State.game.board()[8 - parseInt(square[1], 10)][square.charCodeAt(0) - "a".charCodeAt(0)];
    }

    function clickHandle(square: Square) {
        if (checkTurnLogic(State)) {
            const from = State.board_data.selectedPiece as Square;
            const to = square;
            StateDispatch({ type: "move_piece", payload: { from, to } });
            StateDispatch({ type: "update_selected_square", payload: "" });
        }
        if (!isSquareEmpty(square)) StateDispatch({ type: "update_selected_square", payload: square });
        else StateDispatch({ type: "update_selected_square", payload: "" });
    }

    return (
        <div className="flex ">
            <div className="flex flex-col">
                {State.type === "live" ? (
                    <Banner
                        data={
                            State.board_data.flip === "w"
                                ? { name: State.match_details?.blackId, time: State.board_data.blackTime }
                                : { name: State.match_details?.whiteId, time: State.board_data.whiteTime }
                        }
                    />
                ) : null}
                <ComBoard State={State.board_data} clickHandle={clickHandle} />
                {State.type === "live" ? (
                    <Banner
                        data={
                            State.board_data.flip === "w"
                                ? { name: State.match_details?.whiteId, time: State.board_data.whiteTime }
                                : { name: State.match_details?.blackId, time: State.board_data.blackTime }
                        }
                    />
                ) : null}
                <div className="flex justify-center gap-10">
                    <button className={`${buttonStyle}`} onClick={() => StateDispatch({ type: "prevMove", payload: null })}>
                        prev
                    </button>
                    <button className={`${buttonStyle}`} onClick={() => StateDispatch({ type: "nextMove", payload: null })}>
                        next
                    </button>
                </div>
            </div>
            <div className="" id="settings-bar">
                <div
                    className={`${buttonStyle}`}
                    onClick={() => {
                        StateDispatch({ type: "flip_board", payload: null });
                    }}
                >
                    flip
                </div>
                <div className={`${buttonStyle}`}>setting</div>
            </div>
        </div>
    );
};

export default Board;
