// board.tsx
import React, { useState, useEffect } from "react";
import { checkForValidClick, selectedPieceProps } from "../../modules/types";

import { Chess, SQUARES, Square, PieceSymbol, Color } from "chess.js";
import _ from "lodash";
import io from "socket.io-client";
import { useParams } from "react-router-dom";
import Board from "../../modules/board/board";

const socket = io("http://localhost:3001");

const LiveBoard: React.FC = () => {
    const [selectedPiece, setSelectedPiece] = useState<selectedPieceProps>({ isSelected: false, square: "a0" as Square });
    const [game, setGame] = useState<Chess>(new Chess());
    const [moveundone, setMoveundo] = useState<string[]>([]);
    const [userid, setUserid] = useState(useParams().userid);
    const [turn, setTurn] = useState<Color>(useParams().turn as Color);
    const [gameid, setGameid] = useState(useParams().gameid);
    // const [hasLoaded, setHasLoaded] = useState(false);
    let hasLoaded = false;

    useEffect(() => {
        if (!hasLoaded) {
            console.log(hasLoaded);
            socket.emit("connectwithuserid", { userid, gameid });
            // console.log("connectwithuserid");
            hasLoaded = true;
        }
        socket.on("initialize-prev-moves", (msg: string[]) => {
            setGame((game) => {
                let g = _.cloneDeep(game);
                // console.log("initialie-prev-moves -> ", msg, g.history());
                msg.map((m)=>{g.move(m)});
                return g;
            });
        });

        // Listen for the "message" event and update the messages array
        socket.on("message-rcv", (msg: string) => {
            console.log("message-rcv -> ", msg);
            setGame((g) => {
                let game = _.cloneDeep(g);
                game.move(msg);
                setSelectedPiece({ ...selectedPiece, isSelected: false });
                return game;
            });
        });

        // Clean up the event listener when the component unmounts
        return () => {
            socket.off("message-rcv");
            socket.off("initialize-prev-moves");
        };
    }, []);

    const clickHandle = (props: { from: Square; to: Square }) => {
        const requestData = {
            from: props.from,
            to: props.to,
            userid: userid,
        };

        socket.emit("message", requestData);
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

export default LiveBoard;
