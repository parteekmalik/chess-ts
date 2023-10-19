import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Board from "../../modules/board/board";
import Banner from "../../modules/banner/banner";
import { Chess } from "chess.js";

function Online() {
    const navigate = useNavigate();
    const [userName, setUserName] = useState("");
    const [selectedGameType, setSelectedGameType] = useState<{
        baseTime: number;
        incrementTime: number;
    }>({ baseTime: 10, incrementTime: 0 });
    const [selectedoption, setSelectedoption] = useState("new game");
    const [isGameOption, setIsGameOption] = useState(false);
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

    const handleSubmit = (e: any) => {
        e.preventDefault();
        // localStorage.setItem("userName", userName);
        navigate("/live/12345/1/w");
    };
    return (
        <div className="flex justify-center h-full">
            <Board
                game={new Chess()}
                turn={"w"}
                opponent={{ name: "opponent", time: 0 }}
                player={{ name: "player", time: 0 }}
                gameType={selectedGameType}
            />
            <div className="flex flex-col h-full  text-white" id="options">
                <div className="flex text-xl  cursor-pointer">
                    <div
                        className={`p-5 ${selectedoption === "new game" ? "bg-gray-500" : "bg-gray-700"}`}
                        onClick={() => setSelectedoption("new game")}
                    >
                        new game
                    </div>
                    <div className={`p-5 ${selectedoption === "games" ? "bg-gray-500" : "bg-gray-700"}`} onClick={() => setSelectedoption("games")}>
                        games
                    </div>
                    <div
                        className={`p-5 ${selectedoption === "players" ? "bg-gray-500" : "bg-gray-700"}`}
                        onClick={() => setSelectedoption("players")}
                    >
                        players
                    </div>
                </div>

                <div className="flex h-full flex-col bg-gray-500 user">
                    {selectedoption === "new game" && (
                        <>
                            <div
                                className="my-2 mx-10 bg-gray-400 text-white font-bold py-2 px-4 rounded cursor-pointer text-center"
                                onClick={() => setIsGameOption((prev) => !prev)}
                            >
                                {selectedGameType.baseTime} | {selectedGameType.incrementTime}
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
                                                        {game.baseTime} | {game.incrementTime}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </>
                            )}
                            <div className="mt-2 mx-10  mb-20 bg-green-600 text-white font-bold py-2 px-4 rounded cursor-pointer text-center">
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
