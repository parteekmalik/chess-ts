// board.tsx
import React, { useState, useEffect } from "react";
import { checkForValidClick, selectedPieceProps } from "../../modules/types";

import { Chess, SQUARES, Square, PieceSymbol, Color } from "chess.js";
import _ from "lodash";
import Board from "../../modules/board/board";

const ComputerBoard: React.FC = () => {
    const [selectedPiece, setSelectedPiece] = useState<selectedPieceProps>({ isSelected: false, square: "a0" as Square });
    const [game, setGame] = useState<Chess>(new Chess());
    const [moveundone, setMoveundo] = useState<string[]>([]);
    const [turn , setTurn] = useState<Color>("w");

    const clickHandle = (props: { from: Square; to: Square }) => {
        const { from, to } = props;
        try {
            game.move({ from, to });
        } catch {
            try {
                game.move({ from, to, promotion: "q" as PieceSymbol });
            } catch {
                console.log("invaild move");
            }
        }
    };
    useEffect(() => {
        if (game.turn() == ("b" as Color) && moveundone.length === 0) {
            randomMove();
        }
    }, [game.turn()]);
    const randomMove = () => {
        const newgame = _.cloneDeep(game);
        const moves = game.moves();
        newgame.move(moves[Math.floor(Math.random() * moves.length)]);
        setGame(newgame);
        setSelectedPiece({ ...selectedPiece, isSelected: false });
    };

    return (
        <div className="flex flex-row justify-center ">
            <Board
                clickHandle={clickHandle}
                selectedPiece={selectedPiece}
                game={game}
                moveundone={moveundone}
                setSelectedPiece={setSelectedPiece}
                setMoveundo={setMoveundo}
                setGame={setGame}
                turn={turn}
            />
        </div>
    );
};

export default ComputerBoard;
