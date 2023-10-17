// board.tsx
import React, { useEffect, useState } from "react";
import ChessBoard from "../../modules/piece and hints/ChessBoard";
import ChessBoardHints from "../../modules/piece and hints/ChessBoardHints";
import Highlight from "../../modules/piece and hints/highlight";
import Coordinates from "../coordinates/coordinates";

import { Chess, Color, Square } from "chess.js";
import _ from "lodash";
import { checkForValidClick, selectedPieceProps } from "../types";
import { useParams } from "react-router-dom";
import Banner from "../banner/banner";

interface BoardProps {
    game: Chess;
    selectedPiece: selectedPieceProps;
    clickHandle: (props: { from: Square; to: Square }) => void;
    moveundone: string[];
    setSelectedPiece: React.Dispatch<React.SetStateAction<selectedPieceProps>>;
    setMoveundo: React.Dispatch<React.SetStateAction<string[]>>;
    setGame: React.Dispatch<React.SetStateAction<Chess>>;
    turn: Color;
    opponent: { name: string; time?: number };
    player: { name: string; time?: number };
}

const Board: React.FC<BoardProps> = (props) => {
    const { game, clickHandle, selectedPiece, moveundone, setSelectedPiece, setMoveundo, turn, opponent, player } = props;
    const [flip, setFlip] = useState<Color>(useParams().turn != undefined ? (useParams().turn as Color) : "w");
    console.log(flip);

    const PieceLogic = (event: React.MouseEvent) => {
        const { isValid, square } = checkForValidClick(event, setSelectedPiece, flip);
        if (!isValid || moveundone.length) return;
        if (selectedPiece.isSelected && turn == game.turn()) {
            const from = selectedPiece.square;
            const to = square;
            clickHandle({ from, to });
            setSelectedPiece({ ...selectedPiece, isSelected: false });
        }
        if (game.board()[8 - parseInt(square[1], 10)][square.charCodeAt(0) - "a".charCodeAt(0)]) setSelectedPiece({ isSelected: true, square });
        else setSelectedPiece({ ...selectedPiece, isSelected: false });
    };

    return (
        <div className="flex ">
            <div className="flex flex-col">
                <Banner
                    data={flip == turn ? opponent : player}
                    // time={moveundone.length > 0 ? getTimeTillMove(game.history().length, moveTime, turn).opponentTime : opponentLastTime}
                />
                <div
                    className={` bg-[url('./assets/images/blank_board_img.png')] bg-no-repeat bg-[length:100%_100%] relative w-[500px] h-[500px]`}
                    onClick={PieceLogic}
                >
                    <Coordinates turn={turn} flip={flip} />
                    <Highlight turn={turn} flip={flip} selectedPiece={selectedPiece} game={game} />
                    <ChessBoard turn={turn} flip={flip} BoardLayout={game.board()} />
                    <ChessBoardHints turn={turn} flip={flip} selectedPiece={selectedPiece} game={game} />
                </div>
                <Banner
                    data={flip == turn ? player : opponent}
                    // time={moveundone.length > 0 ? getTimeTillMove(game.history().length, moveTime, turn).playerTime : playerLastTime}
                />
            </div>
            <div className="" id="settings-bar">
                <div
                    className="m-3 bg-green-500 text-white font-bold py-2 px-4 rounded cursor-pointer"
                    onClick={() => {
                        setFlip((cur) => (cur == "w" ? "b" : "w"));
                    }}
                >
                    flip
                </div>
                <div className="m-3 bg-green-500 text-white font-bold py-2 px-4 rounded cursor-pointer">setting</div>
            </div>
        </div>
    );
};

export default Board;
