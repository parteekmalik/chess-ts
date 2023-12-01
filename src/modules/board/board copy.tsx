import React, { useContext, useEffect, useState } from "react";
import ChessBoard from "../../modules/piece and hints/ChessBoard";
import ChessBoardHints from "../../modules/piece and hints/ChessBoardHints";
import Highlight from "../../modules/piece and hints/highlight";
import Coordinates from "../coordinates/coordinates";

import { Chess, Color, Square } from "chess.js";
import { checkForValidClick, selectedPieceProps } from "../types";
import { useParams } from "react-router-dom";
import Banner from "../banner/banner";
import SocketContext from "../../contexts/socket/SocketContext";
import PageContext from "../../contexts/page/PageContext";

interface BoardProps {
    clickHandle: (props: { from: Square; to: Square }) => void;
}

const Board: React.FC<BoardProps> = (props) => {
    const { clickHandle } = props;
    const { SocketState, SocketDispatch } = useContext(SocketContext);
    const { uid } = useContext(PageContext).PageState;

    const PieceLogic = (event: React.MouseEvent) => {
        const { isValid, square } = checkForValidClick(event, SocketState.flip);
        if (!isValid || SocketState.movesUndone.length) return;
        if (SocketState.selectedPiece && uid === (SocketState.game.turn() === "w" ? SocketState.whitePlayerId : SocketState.blackPlayerId)) {
            const from = SocketState.selectedPiece as Square;
            const to = square;
            clickHandle({ from, to });
            SocketDispatch({ type: "update_selected_square", payload: "" });
        }
        if (SocketState.game.board()[8 - parseInt(square[1], 10)][square.charCodeAt(0) - "a".charCodeAt(0)])
            SocketDispatch({ type: "update_selected_square", payload: square });
        else SocketDispatch({ type: "update_selected_square", payload: "" });
    };

    return (
        <div className="flex ">
            <div className="flex flex-col">
                <Banner
                    data={
                        SocketState.flip === "w"
                            ? { name: SocketState.blackPlayerId, time: SocketState.blackTime }
                            : { name: SocketState.whitePlayerId, time: SocketState.whiteTime }
                    }
                />
                <div className={` bg-[url('./assets/images/blank_board_img.png')] bg-no-repeat bg-[length:100%_100%] relative w-[500px] h-[500px]`} onClick={PieceLogic}>
                    <Coordinates flip={SocketState.flip} />
                    <Highlight selectedPiece={SocketState.selectedPiece} flip={SocketState.flip} lastMove={SocketState.game.history({ verbose: true }).pop()} />
                    <ChessBoard game={SocketState.game} flip={SocketState.flip} />
                    {SocketState.selectedPiece && (
                        <ChessBoardHints
                            game={SocketState.game}
                            selectedPiece={SocketState.selectedPiece}
                            flip={SocketState.flip}
                            isShow={uid !== (SocketState.game.turn() === "w" ? SocketState.whitePlayerId : SocketState.blackPlayerId)}
                        />
                    )}
                </div>
                <Banner
                    data={
                        SocketState.flip === "w"
                            ? { name: SocketState.whitePlayerId, time: SocketState.whiteTime }
                            : { name: SocketState.blackPlayerId, time: SocketState.blackTime }
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
            </div>
        </div>
    );
};

export default Board;
