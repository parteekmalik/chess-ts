import React, { useEffect, useState } from "react";
import ChessBoard from "../../modules/piece and hints/ChessBoard";
import ChessBoardHints from "../../modules/piece and hints/ChessBoardHints";
import Highlight from "../../modules/piece and hints/highlight";
import Coordinates from "../coordinates/coordinates";

import { Chess, Color, Square } from "chess.js";
import { checkForValidClick, selectedPieceProps } from "../types";
import { useParams } from "react-router-dom";
import Banner from "../banner/banner";

interface BoardProps {
    game: Chess;
    turn: Color;
    opponent: { name: string; time?: number };
    player: { name: string; time?: number };
    gameType?: { baseTime: number, incrementTime: number };
    // Make the specific props optional
    selectedPiece?: selectedPieceProps;
    clickHandle?: (props: { from: Square; to: Square }) => void;
    moveundone?: string[];
    setSelectedPiece?: React.Dispatch<React.SetStateAction<selectedPieceProps>>;
    setMoveundo?: React.Dispatch<React.SetStateAction<string[]>>;
    setGame?: React.Dispatch<React.SetStateAction<Chess>>;
}

const Board: React.FC<BoardProps> = (props) => {
    const { game, clickHandle, selectedPiece, moveundone, setSelectedPiece, setMoveundo, turn, opponent, player, gameType } = props;
    const [flip, setFlip] = useState<Color>(useParams().turn != undefined ? (useParams().turn as Color) : "w");

    const PieceLogic = (event: React.MouseEvent) => {
        const { isValid, square } = checkForValidClick(event, flip, setSelectedPiece);
        if (!isValid || moveundone?.length) return;
        if (selectedPiece?.isSelected && turn == game.turn()) {
            const from = selectedPiece.square;
            const to = square;
            clickHandle?.({ from, to });
            setSelectedPiece?.({ ...selectedPiece, isSelected: false });
        }
        if (game.board()[8 - parseInt(square[1], 10)][square.charCodeAt(0) - "a".charCodeAt(0)]) setSelectedPiece?.({ isSelected: true, square });
        else
            setSelectedPiece
                ? setSelectedPiece((selectedPiece) => {return { ...selectedPiece, isSelected: false };}) // prettier-ignore
                : {};
    };

    return (
        <div className="flex ">
            <div className="flex flex-col">
                <Banner data={flip == turn ? { ...opponent, gameTime: gameType } : { ...player, gameTime: gameType }} />
                <div
                    className={` bg-[url('./assets/images/blank_board_img.png')] bg-no-repeat bg-[length:100%_100%] relative w-[500px] h-[500px]`}
                    onClick={PieceLogic}
                >
                    <Coordinates turn={turn} flip={flip} />
                    {selectedPiece && <Highlight turn={turn} flip={flip} selectedPiece={selectedPiece} game={game} />}
                    <ChessBoard turn={turn} flip={flip} BoardLayout={game.board()} />
                    {selectedPiece && <ChessBoardHints turn={turn} flip={flip} selectedPiece={selectedPiece} game={game} />}
                </div>
                <Banner data={flip == turn ? { ...player, gameTime: gameType } : { ...opponent, gameTime: gameType }} />
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
