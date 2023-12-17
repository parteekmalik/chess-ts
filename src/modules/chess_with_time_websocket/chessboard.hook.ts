import { Chess, Square } from "chess.js";
import moment from "moment";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import _, { has } from "lodash";

const getTimeTillMove = (index: number, moveTime: number[], matchDetails: { matchid: string; whiteUserid: string; blackUserid: string }) => {
    let whiteTimeTaken = 0;
    let blackTimeTaken = 0;
    for (let i = 1; i < index + 2; i += 2) {
        whiteTimeTaken += moveTime[i] - moveTime[i - 1];
    }
    for (let i = 2; i < index + 2; i += 2) {
        blackTimeTaken += moveTime[i] - moveTime[i - 1];
    }
    if (sessionStorage.getItem("username") === matchDetails.whiteUserid) return { playerTime: whiteTimeTaken, opponentTime: blackTimeTaken };
    else return { opponentTime: whiteTimeTaken, playerTime: blackTimeTaken };
};

export const useChessLiveBoard = (props: {
    gameType: { baseTime: number; incrementTime: number };
    matchDetails: { matchid: string; whiteUserid: string; blackUserid: string };
}) => {
    const { gameType, matchDetails } = props;
    const [game, setGame] = useState(new Chess());
    const [moveTimes, setMoveTimes] = useState<number[]>([]);
    const [moveUndone, setMoveUndone] = useState<string[]>([]);
    const [opponentTimeLeft, setOpponentTimeLeft] = useState(0);
    const [playerTimeLeft, setPlayerTimeLeft] = useState(0);
    const [overStats, setOverStats] = useState<string>("");
    const [socket, setSocket] = useState(io("http://localhost:3001"));
    let hasloaded = false;

    useEffect(() => {
        if (!hasloaded) {
            console.log("connectwithuserid");
            hasloaded = true;
            socket.emit("connectwithuserid", { userid: sessionStorage.getItem("username"), matchid: matchDetails.matchid });
        }
        socket.on(
            "initialize-prev-moves",
            (msg: { history: string[]; startedAt: Date; moveTime: Date[]; curTime: Date; game_stats: { isover: boolean; winner: string; reason: string } }) => {
                const { history, game_stats } = msg;
                let { moveTime } = msg;
                console.log("initialize-prev-moves -> ", msg);
                setMoveTimes([...moveTimes, ...moveTime.map((d) => moment(d).toDate().getTime())]);
                setGame((g) => {
                    for (let i = game.history.length; i < history.length; i++) g.move(history[i]);
                    return _.cloneDeep(g);
                });
                setOverStats(game_stats.reason);
            }
        );
        socket.on("message-rcv", (msg: { move: string; time: Date }) => {
            const { move, time } = msg;
            const moveTime = moment(time).toDate().getTime();
            console.log("message-rcv -> ", msg, moveTime, moment().toDate().getTime());
            setMoveTimes([...moveTimes, moveTime]);
            setGame((g) => {
                g.move(move);
                return _.cloneDeep(g);
            });
        });
        socket.on("game-over-byMove", (msg: { move: string; time: Date; game_stats: { isover: boolean; reason: string; winner: string } }) => {
            const { move, time, game_stats } = msg;
            const moveTime = moment(time).toDate().getTime();
            console.log("message-rcv -> ", msg, moveTime, moment().toDate().getTime());
            setMoveTimes([...moveTimes, moveTime]);
            setGame((g) => {
                g.move(move);
                return _.cloneDeep(g);
            });
            setOverStats(game_stats.reason);
        });

        // Clean up the event listener when the component unmounts
        return () => {
            socket.off("message-rcv");
            socket.off("initialize-prev-moves");
            socket.off("game-over-byMove");
        };
    }, []);
    function sendMove(requestData: { from: Square; to: Square; userid: any }) {
        socket.emit("message", requestData);
    }
    return { game, sendMove, opponentTimeLeft, playerTimeLeft, moveUndone };
};
