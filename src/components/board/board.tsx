// board.tsx
import "./board.css";
import React, { useState, useEffect } from "react";
import { boardSize, checkForValidClick, HintsProps, selectedPieceProps } from "../types";
import ChessBoard from "../piece and hints/ChessBoard";
import ChessBoardHints from "../piece and hints/ChessBoardHints";
import Highlight from "../piece and hints/highlight";
import Coordinates from "../coordinates/coordinates";

import { Chess, SQUARES, Square, PieceSymbol } from "chess.js";
import _ from "lodash";
import io from "socket.io-client";
import { useParams } from "react-router-dom";

const socket = io("http://localhost:3001");

const Board: React.FC = () => {
    const [selectedPiece, setSelectedPiece] = useState<selectedPieceProps>({ isSelected: false, square: "a0" as Square });
    const [game, setGame] = useState<Chess>(new Chess());
    const [moveundone, setMoveundo] = useState<string[]>([]);
    const [userid, setUserid] = useState(useParams().userid);
    const [gameid, setGameid] = useState(useParams().gameid);

    useEffect(() => {
        // Listen for the "message" event and update the messages array
        socket.on("message-rcv", (msg: string) => {
            console.log("message-rcv -> ", msg);
            setGame((game) => {
                const newgame = _.cloneDeep(game);
                newgame.move(msg);
                setSelectedPiece({ isSelected: false, square: "a0" as Square });
                return newgame;
            });
        });

        // Clean up the event listener when the component unmounts
        return () => {
            socket.off("message-rcv");
        };
    }, [socket]);

    useEffect(() => {
        socket.emit("connectwithuserid", { userid });
    }, []);

    const clickHandle = (event: React.MouseEvent) => {
        const { isValid, row, col } = checkForValidClick(event, setSelectedPiece);

        if (!isValid || moveundone.length) return;

        if (selectedPiece.isSelected) {
            if (moveundone.length) return;

            const requestData = {
                from: selectedPiece.square,
                to: SQUARES[row * 8 + col],
                userid: userid,
            };

            socket.emit("message", requestData);

            setSelectedPiece({ isSelected: false, square: "a0" as Square });
        }
        if (game.board()[row][col]) setSelectedPiece({ isSelected: true, square: SQUARES[row * 8 + col] });
        else setSelectedPiece({ isSelected: false, square: "a0" as Square });
    };
    const handleprev = (event: React.MouseEvent) => {
        const newgame = _.cloneDeep(game);
        if (newgame.history()[newgame.history().length - 1]) setMoveundo([...moveundone, newgame.history()[newgame.history().length - 1]]);
        newgame.undo();
        setGame(newgame);
    };
    const handlenext = (event: React.MouseEvent) => {
        const newgame = _.cloneDeep(game);
        if (moveundone.length) {
            newgame.move(moveundone[moveundone.length - 1]);
            moveundone.pop();
            setMoveundo(moveundone);
        }
        setGame(newgame);
    };

    return (
        <div>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleprev}>
                prev
            </button>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handlenext}>
                next
            </button>
            <div className="chess-board" onClick={clickHandle} style={{ width: boardSize + "px", height: boardSize + "px" }}>
                <Coordinates />
                <Highlight selectedPiece={selectedPiece} game={game} />
                <ChessBoard BoardLayout={game.board()} />
                <ChessBoardHints selectedPiece={selectedPiece} game={game} />
            </div>
            {/* <div>{}</div> */}
        </div>
    );
};

export default Board;
