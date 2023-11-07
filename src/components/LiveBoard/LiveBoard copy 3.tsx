// board.tsx
import React, { useState, useEffect } from "react";

import { Chess, Color, Square } from "chess.js";
import moment from "moment";
import { selectedPieceProps } from "../../modules/types";
import Board from "../../modules/board/board";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import { useChessLiveBoard } from "../../modules/chess_with_time_websocket/chessboard.hook";

// const game1 = new Chess({ link: "http://localhost:3001", whiteName: "1", blackName: "2", gameType: { baseTime: 10, incrementTime: 0 } })
console.log("hiii");
const matchDetails = { matchid: "12345", whiteUserid: "1", blackUserid: "2" };

const LiveBoard: React.FC = () => {
    const [userid, setuserid] = useState(useParams().userid);
    const { game, sendMove, opponentTimeLeft, playerTimeLeft, moveUndone } = useChessLiveBoard({
        gameType: { baseTime: 10, incrementTime: 0 },
        matchDetails,
    });
    const [turn, setTurn] = useState<Color>(useParams().turn as Color);
    const [selectedPiece, setSelectedPiece] = useState<selectedPieceProps>({ isSelected: false, square: "a0" as Square });
    const [matchid, setMatchid] = useState(useParams().matchid);
    useEffect(() => {
        console.log(userid);
    }, []);
    const clickHandle = (props: { from: Square; to: Square }) => {
        const requestData = {
            from: props.from,
            to: props.to,
            userid: userid,
        };
        console.log("Liveboard clickhandle");
        sendMove(requestData);
    };
    return (
        <div className="">
            <Board
                clickHandle={clickHandle}
                selectedPiece={selectedPiece}
                setSelectedPiece={setSelectedPiece}
                game={game}
                turn={turn}
                moveundone={moveUndone}
                opponent={{ name: "opponent", time: opponentTimeLeft }}
                player={{ name: "player", time: playerTimeLeft }}
            />
        </div>
    );
};

export default LiveBoard;
