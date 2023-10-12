// board.tsx
import React, { useEffect } from "react";
import ChessBoard from "../../modules/piece and hints/ChessBoard";
import ChessBoardHints from "../../modules/piece and hints/ChessBoardHints";
import Highlight from "../../modules/piece and hints/highlight";
import Coordinates from "../coordinates/coordinates";

import { Chess, Color, PieceSymbol, SQUARES, Square } from "chess.js";
import _ from "lodash";
import { checkForValidClick, selectedPieceProps } from "../types";

const MovesDisplay: React.FC<{ moves: string[] }> = ({ moves }) => {
    const displaymov = [];
    for (let i = 0; i < moves.length; i += 2) {
        displaymov.push(
            <div className="flex" key={"history" + i + ","}>
                <div className="mx-20" key={"history" + i}>
                    {moves[i]}
                </div>
                <div className="mx-20" key={"history" + (i + 1)}>
                    {moves[i + 1]}
                </div>
            </div>
        );
    }
    return displaymov;
};

interface BoardProps {
    game: Chess;
    selectedPiece: selectedPieceProps;
    clickHandle: (props: { from: Square; to: Square }) => void;
    moveundone: string[];
    setSelectedPiece: React.Dispatch<React.SetStateAction<selectedPieceProps>>;
    setMoveundo: React.Dispatch<React.SetStateAction<string[]>>;
    setGame: React.Dispatch<React.SetStateAction<Chess>>;
    turn: Color;
}

const Board: React.FC<BoardProps> = (props) => {
    const { game, clickHandle, selectedPiece, moveundone, setSelectedPiece, setMoveundo, setGame, turn } = props;
    const PieceLogic = (event: React.MouseEvent) => {
        const { isValid, row, col } = checkForValidClick(event, setSelectedPiece);

        if (!isValid || moveundone.length) return;
        if (selectedPiece.isSelected && turn == game.turn()) {
            if (moveundone.length) return;
            const from = selectedPiece.square;
            const to = SQUARES[row * 8 + col];
            clickHandle({ from, to });
            setSelectedPiece({ ...selectedPiece, isSelected: false });
        }
        if (game.board()[row][col]) setSelectedPiece({ isSelected: true, square: SQUARES[row * 8 + col] });
        else setSelectedPiece({ ...selectedPiece, isSelected: false });
    };

    const handleprev = (event: React.MouseEvent) => {
        const newgame = _.cloneDeep(game);
        if (newgame.history()[newgame.history().length - 1]) setMoveundo([...moveundone, newgame.history()[newgame.history().length - 1]]);
        newgame.undo();
        setGame(newgame);
        setSelectedPiece({ ...selectedPiece, isSelected: false });
    };
    const handlenext = (event: React.MouseEvent) => {
        const newgame = _.cloneDeep(game);
        if (moveundone.length) {
            newgame.move(moveundone[moveundone.length - 1]);
            moveundone.pop();
            setMoveundo(moveundone);
            setGame(newgame);
        }
        setSelectedPiece({ ...selectedPiece, isSelected: false });
    };
    return (
        <>
            <div className="">
                <div
                    className='bg-[url("./assets/images/blank_board_img.png")] bg-no-repeat bg-[length:100%_100%] relative mt-[100px] m-auto w-[500px] h-[500px]'
                    onClick={PieceLogic}
                >
                    <Coordinates />
                    <Highlight selectedPiece={selectedPiece} game={game} />
                    <ChessBoard BoardLayout={game.board()} />
                    {turn == game.turn() && <ChessBoardHints selectedPiece={selectedPiece} game={game} />}
                </div>
                <div className="flex justify-center items-center">
                    <button className="w-60 h-20 m-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleprev}>
                        prev
                    </button>
                    <button className="w-60 h-20  m-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handlenext}>
                        next
                    </button>
                </div>
            </div>
            <div className="flex flex-col mt-20" id="moves_played_navigate">
                <MovesDisplay moves={game.history()} />
            </div>
        </>
    );
};

export default Board;
