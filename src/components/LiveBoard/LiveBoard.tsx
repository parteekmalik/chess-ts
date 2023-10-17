// board.tsx
import React, { useState, useEffect } from "react";
import { selectedPieceProps } from "../../modules/types";

import { Chess, Square, Color } from "chess.js";
import _ from "lodash";
import io from "socket.io-client";
import { useParams } from "react-router-dom";
import Board from "../../modules/board/board";
import Displaymovesandbuttons from "../../modules/displaymovesandbuttons/displaymovesandbuttons";
import Banner from "../../modules/banner/banner";
import moment from "moment";
import axios from "axios";

const socket = io("http://localhost:3001");

async function makeHttpRequest(url: string): Promise<any> {
    try {
        const response = await axios.get(url);
        // You can handle the response data here
        console.log("Response data:", response.data);
        return response.data;
    } catch (error) {
        // Handle errors
        console.error("Error:", (error as Error).message);
        throw error;
    }
}

const getTimeTillMove = (index: number, moveTime: number[], turn: Color) => {
    let whiteTimeTaken = 0;
    let blackTimeTaken = 0;
    for (let i = 1; i < index + 2; i += 2) {
        whiteTimeTaken += moveTime[i] - moveTime[i - 1];
    }
    for (let i = 2; i < index + 2; i += 2) {
        blackTimeTaken += moveTime[i] - moveTime[i - 1];
    }
    if (turn == "w") return { playerTime: whiteTimeTaken, opponentTime: blackTimeTaken };
    else return { opponentTime: whiteTimeTaken, playerTime: blackTimeTaken };
};
const LiveBoard: React.FC = () => {
    let hasLoaded = false;
    const [isover, setIsover] = useState<boolean>(false);
    const [selectedPiece, setSelectedPiece] = useState<selectedPieceProps>({ isSelected: false, square: "a0" as Square });
    const [game, setGame] = useState<Chess>(new Chess());
    const [moveundone, setMoveundo] = useState<string[]>([]);
    const [userid, setUserid] = useState(useParams().userid);
    const [turn, setTurn] = useState<Color>(useParams().turn as Color);
    const [matchid, setMatchid] = useState(useParams().matchid);
    const [opponentLastTime, setOpponentLastTime] = useState<number>(moment().toDate().getTime());
    const [playerLastTime, setPlayerLastTime] = useState<number>(moment().toDate().getTime());
    const [moveTime, setMoveTime] = useState<number[]>([]);
    const [overStats, setOverStats] = useState<{ isover: boolean; reason: string; winner: string }>({
        isover: false,
        winner: "still playing",
        reason: "still playing",
    });

    useEffect(() => {
        console.log("useeffect moveTime -> ",moveTime.map((d) => moment(d).toDate())); //prettier-ignore
        const { opponentTime, playerTime } = getTimeTillMove(game.history().length + moveundone.length, moveTime, turn);
        console.log("opponentTime -> ", opponentTime, "playerTime -> ", playerTime);
        setOpponentLastTime(opponentTime);
        setPlayerLastTime(playerTime);
    }, [moveTime, game]);

    useEffect(() => {
        if (overStats.isover) return;
        let interval: number;

        if (turn == game.turn()) {
            interval = setInterval(() => setPlayerLastTime((prevTime) => prevTime + 10), 10);
        } else {
            interval = setInterval(() => setOpponentLastTime((prevTime) => prevTime + 10), 10);
        }
        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [game.turn()]);

    //socket.io lisners
    useEffect(() => {
        if (!hasLoaded) {
            socket.emit("connectwithuserid", { userid, matchid });
            // console.log("connectwithuserid");
            hasLoaded = true;
        }
        async function initialize_prev_moves(msg: {
            history: string[];
            startedAt: Date;
            moveTime: Date[];
            curTime: Date;
            stats: { isover: boolean; winner: string; reason: string };
        }) {
            const { history, stats } = msg;
            let { moveTime } = msg;
            console.log(msg);

            setGame((game) => {
                const g = _.cloneDeep(game);
                history.map((m) => g.move(m));
                return g;
            });
            if (stats.isover) moveTime.pop();
            await makeHttpRequest("http://localhost:3002/getTime").then((data) => {
                moveTime.push(moment(data).toDate());
                setMoveTime(moveTime.map((d) => moment(d).toDate().getTime()));
            });
            setOverStats(stats);
        }
        socket.on(
            "initialize-prev-moves",
            (msg: {
                history: string[];
                startedAt: Date;
                moveTime: Date[];
                curTime: Date;
                stats: { isover: boolean; winner: string; reason: string };
            }) => {
                initialize_prev_moves(msg);
            }
        );
        socket.on("message-rcv", (msg: { move: string; time: Date }) => {
            const { move, time } = msg;
            const moveTime = moment(time).toDate().getTime();
            console.log("message-rcv -> ", msg, moveTime, moment().toDate().getTime());
            setMoveTime((t) => [...t, moveTime]);
            setGame((g) => {
                let game = _.cloneDeep(g);
                game.move(move);
                setSelectedPiece({ ...selectedPiece, isSelected: false });
                return game;
            });
        });
        socket.on("game-over-byMove", (msg: { move: string; time: Date; stats: { isover: boolean; reason: string; winner: string } }) => {
            setIsover(true);
            const { move, time, stats } = msg;
            const moveTime = moment(time).toDate().getTime();
            console.log("message-rcv -> ", msg, moveTime, moment().toDate().getTime());
            setMoveTime((t) => [...t, moveTime]);
            setGame((g) => {
                let game = _.cloneDeep(g);
                game.move(move);
                setSelectedPiece({ ...selectedPiece, isSelected: false });
                return game;
            });
            setOverStats(stats);
        });

        // Clean up the event listener when the component unmounts
        return () => {
            socket.off("message-rcv");
            socket.off("initialize-prev-moves");
            socket.off("game-over-byMove");
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
        <div className="">
            <div className="flex flex-row justify-center ">
                <div className="flex flex-col relative">
                    <Board
                        clickHandle={clickHandle}
                        selectedPiece={selectedPiece}
                        game={game}
                        moveundone={moveundone}
                        setSelectedPiece={setSelectedPiece}
                        setMoveundo={setMoveundo}
                        setGame={setGame}
                        turn={turn}
                        opponent={{ name: "opponent", time: opponentLastTime }}
                        player={{ name: "player", time: playerLastTime }}
                    />
                </div>
                {overStats.isover && (
                    <div id="flex flex-col game-over-display h-500px">
                        <div className="flex flex-col items-center justify-center bg-slate-400 text-white">
                            <div className="text-3xl">{overStats.winner == "w" ? "White won" : overStats.winner == "b" ? "Black won" : "Draw"}</div>
                            <div>by {overStats.reason}</div>
                        </div>
                        <div className="flex flex-col justify-center items-center bg-slate-600 rounded text-white">
                            <div className="flex ">
                                <div className="m-5">mistake</div>
                                <div className="m-5">blunders</div>
                                <div className="m-5">misses</div>
                            </div>
                            <div className="m-3 cursor-pointer  bg-green-500 text-white font-bold py-2 px-4 rounded">Game Review</div>
                            <div className="flex">
                                <div className="m-3 cursor-pointer  bg-green-500 text-white font-bold py-2 px-4 rounded">New 10 min</div>
                                <div className="m-3 cursor-pointer  bg-green-500 text-white font-bold py-2 px-4 rounded">Reamtch</div>
                            </div>
                            <div className="h-[300px] pt-10 text-5xl"> Adds</div>
                        </div>
                    </div>
                )}

                <Displaymovesandbuttons
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
        </div>
    );
};

export default LiveBoard;
