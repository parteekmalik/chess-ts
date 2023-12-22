import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Board from "../../modules/board/board";
import Banner from "../../modules/banner/banner";
import { Chess } from "chess.js";
import axios from "axios";
import PageContext from "../../contexts/page/PageContext";

function Online() {
    const gameTypes = {
        bullet: [
            { baseTime: 1, incrementTime: 0 },
            { baseTime: 1, incrementTime: 1 },
            { baseTime: 2, incrementTime: 1 },
        ],
        blitz: [
            { baseTime: 3, incrementTime: 0 },
            { baseTime: 3, incrementTime: 2 },
            { baseTime: 5, incrementTime: 0 },
        ],
        rapid: [
            { baseTime: 10, incrementTime: 0 },
            { baseTime: 15, incrementTime: 10 },
            { baseTime: 30, incrementTime: 0 },
        ],
    };
    const navigate = useNavigate();
    const [userName, setUserName] = useState("");
    const [selectedGameType, setSelectedGameType] = useState<{
        baseTime: number;
        incrementTime: number;
    }>({ baseTime: 10, incrementTime: 0 });
    const [isSelectedoption, setIsSelectedoption] = useState("new game");
    const [isGameOption, setIsGameOption] = useState(false);
    const { uid } = useContext(PageContext).PageState;
    let isloading = true;
    const { PageState, PageDispatch } = useContext(PageContext);

    useEffect(() => {
        const guestId = async () => {
            if (uid) return;

            const guestUserId: string = (await axios.get(`http://localhost:3002/getGuestId`)).data;
            console.log(guestUserId);
            // Save the username to sessionStorage on successful login
            PageDispatch({ type: "update_uid", payload: guestUserId });

            sessionStorage.setItem("uid", guestUserId);
        };
        if (isloading) {
            console.info(PageState.uid, sessionStorage.getItem("uid"));
            guestId();
        }
        isloading = false;
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const payload = { userid: uid, gameType: { ...selectedGameType, baseTime: selectedGameType.baseTime * 60000 } };
            const response: {
                matchId: number;
                position: string;
                startedAt: Date;
                stats: string;
                whiteId: string;
                blackId: string;
                baseTime: number;
                incrementTime: number;
                movesData: { move: string; time: string }[];
            } = (await axios.post("http://localhost:3002/new", payload)).data;
            console.log("Response:", response);
            navigate(`/live/${response.matchId}/${uid}/${response.whiteId === uid ? "w" : "b"}`);
            // Do something with the response data
        } catch (error) {
            console.error("Error:", error);
            // Handle the error
        }
    };
    return (
        <div className="flex justify-center h-full">
            {/* <Board
                game={new Chess()}
                turn={"w"}
                opponent={{ name: "opponent", time: 0 }}
                player={{ name: PageState.uid as string, time: 0 }}
                gameType={selectedGameType}
            /> */}
            <div className="flex flex-col h-full  text-white" id="options">
                <div className="flex text-xl  cursor-pointer">
                    <div className={`p-5 ${isSelectedoption === "new game" ? "bg-gray-500" : "bg-gray-700"}`} onClick={() => setIsSelectedoption("new game")}>
                        new game
                    </div>
                    <div className={`p-5 ${isSelectedoption === "games" ? "bg-gray-500" : "bg-gray-700"}`} onClick={() => setIsSelectedoption("games")}>
                        games
                    </div>
                    <div className={`p-5 ${isSelectedoption === "players" ? "bg-gray-500" : "bg-gray-700"}`} onClick={() => setIsSelectedoption("players")}>
                        players
                    </div>
                </div>

                <div className="flex h-full flex-col bg-gray-500 user">
                    {isSelectedoption === "new game" && (
                        <>
                            <div
                                className="my-2 mx-10 bg-gray-400 text-white font-bold py-2 px-4 rounded cursor-pointer text-center"
                                onClick={() => setIsGameOption((prev) => !prev)}
                            >
                                {selectedGameType.baseTime}
                                {selectedGameType.incrementTime > 0 ? " | " + selectedGameType.incrementTime : " min"}
                            </div>
                            {isGameOption && (
                                <>
                                    {Object.entries(gameTypes).map(([gameTypeName, games]) => (
                                        <div key={gameTypeName}>
                                            <h2 className="text-xl ml-5">
                                                <img src=""></img>
                                                {gameTypeName}
                                            </h2>
                                            <ul className="flex items-center justify-center">
                                                {games.map((game, index) => (
                                                    <li
                                                        key={index}
                                                        className="bg-slate-700 rounded px-5 py-2 m-2 cursor-pointer"
                                                        onClick={() => setSelectedGameType(game)}
                                                    >
                                                        {game.baseTime}
                                                        {game.incrementTime > 0 ? " | " + game.incrementTime : " min"}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </>
                            )}
                            <div className="mt-2 mx-10  mb-20 bg-green-600 text-white font-bold py-2 px-4 rounded cursor-pointer text-center" onClick={handleSubmit}>
                                Play
                            </div>
                            <div className="flex text-2xl justify-center m-3 bg-gray-400 text-white font-bold py-2 px-4 rounded cursor-pointer text-center">
                                <img className="h-10" src="https://www.chess.com/bundles/web/images/color-icons/handshake.svg"></img>play a friend
                            </div>
                            <div className="flex text-2xl justify-center m-3 bg-gray-400 text-white font-bold py-2 px-4 rounded cursor-pointer text-center">
                                <img className="h-10" src="https://www.chess.com/bundles/web/images/color-icons/tournaments.svg"></img>tournaments
                            </div>
                            <div className="text-xl grow ml-5">
                                upcoming tournaments
                                {/* {display all upcoming tournaments} */}
                            </div>
                            <div className="flex gap-10 mx-auto ">
                                <div>{2} Playing</div>
                                <div>{1} Games</div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Online;
