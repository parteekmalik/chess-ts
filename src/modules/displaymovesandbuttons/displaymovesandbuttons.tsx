import { Chess, Color, Square } from "chess.js";
import React from "react";
import { selectedPieceProps } from "../types";
import _ from "lodash";

const MovesDisplay: React.FC<{ moves: string[] }> = ({ moves }) => {
    const displaymov = [];
    for (let i = 0; i < moves.length; i += 2) {
        displaymov.push(
            <div className="flex" key={"history" + i + ","}>
                {i / 2 + 1}
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
const GameOver: React.FC<{ game: Chess }> = ({ game }) => {
    return (
        <div className="absolute top-[53%] left-[21%]   ">
            gameover {game.isCheckmate() && <p>Checkmate</p>}
            {game.isDraw() && <p>Draw</p>}
        </div>
    );
};

interface DisplaymovesandbuttonsProps {
    game: Chess;
    selectedPiece: selectedPieceProps;
    clickHandle: (props: { from: Square; to: Square }) => void;
    moveundone: string[];
    setSelectedPiece: React.Dispatch<React.SetStateAction<selectedPieceProps>>;
    setMoveundo: React.Dispatch<React.SetStateAction<string[]>>;
    setGame: React.Dispatch<React.SetStateAction<Chess>>;
    turn: Color;
    flip: Color;
}

const Displaymovesandbuttons: React.FC<DisplaymovesandbuttonsProps> = (props) => {
    const { game, moveundone, setGame, setSelectedPiece, setMoveundo, selectedPiece,flip } = props;
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
            {game.isGameOver() && <GameOver game={game} />}
            <div className="flex flex-col m-20" id="moves_played_navigate">
                <div className="flex justify-center items-center">
                    <button className="w-60 h-20 m-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleprev}>
                        prev
                    </button>
                    <button className="w-60 h-20  m-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handlenext}>
                        next
                    </button>
                </div>
                <div className="overflow-y-auto h-[400px] will-change-auto ">
                    <MovesDisplay moves={[...game.history(), ...moveundone.slice(0).reverse()]} />
                </div>
            </div>
        </>
    );
};

export default Displaymovesandbuttons;
