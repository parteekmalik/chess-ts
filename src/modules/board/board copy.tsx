import React, { useContext, useEffect, useState } from "react";

import { Chess, Color, Square } from "chess.js";
import Banner from "../banner/banner";
import SocketContext from "../../contexts/socket/SocketContext";
import PageContext from "../../contexts/page/PageContext";
import ComBoard from "../../1making common component/board";

interface BoardProps {}

const Board: React.FC<BoardProps> = (props) => {
    // const { SocketState, SocketDispatch } = useContext(SocketContext);
    // const { uid } = useContext(PageContext).PageState;

    // function clickHandle(square: Square) {
    //     if (
    //         SocketState.board_data.selectedPiece &&
    //         SocketState.match_prev_details.movesUndone.length === 0 &&
    //         (SocketState.game.turn() === "w" ? SocketState.match_details.whitePlayerId : SocketState.match_details.blackPlayerId)
    //     ) {
    //         const from = SocketState.board_data.selectedPiece as Square;
    //         const to = square;
    //         SocketDispatch({type:"move_piece",payload:{from, to}})
    //         SocketDispatch({ type: "update_selected_square", payload: "" });
    //     }
    //     if (SocketState.game.board()[8 - parseInt(square[1], 10)][square.charCodeAt(0) - "a".charCodeAt(0)])
    //         SocketDispatch({ type: "update_selected_square", payload: square });
    //     else SocketDispatch({ type: "update_selected_square", payload: "" });
    // }

    return (
        <div className="flex ">
            {/* <div className="flex flex-col">
                <Banner
                    data={
                        SocketState.board_data.flip === "w"
                            ? { name: SocketState.match_details.blackPlayerId, time: SocketState.board_data.blackTime }
                            : { name: SocketState.match_details.whitePlayerId, time: SocketState.board_data.whiteTime }
                    }
                />
                <ComBoard State={SocketState.board_data} clickHandle={clickHandle} />
                <Banner
                    data={
                        SocketState.board_data.flip === "w"
                            ? { name: SocketState.match_details.whitePlayerId, time: SocketState.board_data.whiteTime }
                            : { name: SocketState.match_details.blackPlayerId, time: SocketState.board_data.blackTime }
                    }
                />
            </div>
            <div className="" id="settings-bar">
                <div
                    className="m-3 bg-green-500 text-white font-bold py-2 px-4 rounded cursor-pointer"
                    onClick={() => SocketDispatch({ type: "flip_board", payload: null })}
                >
                    flip
                </div>
                <div className="m-3 bg-green-500 text-white font-bold py-2 px-4 rounded cursor-pointer">setting</div>
            </div> */}
        </div>
    );
};

export default Board;
