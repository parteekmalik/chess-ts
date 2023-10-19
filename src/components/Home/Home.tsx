import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
    return (
        <div className="flex m-auto flex-col justify-center items-center ">
            <div className="max-w-[110rem] text-gray-800 ">
                <div className="w-[100%] flex flex-row justify-center items-center mb-10  max-w-[108rem]">
                    <img className="max-w-[40rem] w-[40rem]  m-10" src="./src/assets/images/board_img.png" alt="chess_board"></img>
                    <div className="m-10  flex flex-col grow justify-center items-center ">
                        <p className="text-6xl text-center decoration-solid mb-4">
                            Play Chess
                            <br /> Online
                            <br /> on the #1 Site!
                        </p>
                        <div className="flex my-4 justify-center text-2xl">
                            <Link to={"/findmatch"}>
                                <div className=" mr-5 ml-5   ">{0} Games Today</div>
                            </Link>
                            <Link to={"/computer"}>
                                <div className="mr-5 ml-5  ">{0} Palying Now</div>
                            </Link>
                        </div>
                        <div className="flex flex-col w-[100%] ">
                            <Link to={"/play/online"}>
                                <div className="cursor-pointer mb-10 bg-gray-200 p-4 rounded-2xl flex items-center  ">
                                    <img
                                        className="text-xs w-12 h-auto mx-10"
                                        src="https://www.chess.com/bundles/web/images/color-icons/playwhite.cea685ba.svg"
                                        alt="chess_comp_img"
                                    />
                                    <div className="grow my-5">
                                        <p className="text-5xl mb-2">Play Online</p>
                                        <div className="text-base mt-1">Play with someone with your Level</div>
                                    </div>
                                </div>
                            </Link>
                            <Link to={"/play/computer"}>
                                <div className=" bg-gray-200 p-4 rounded-2xl flex items-center cursor-pointer  ">
                                    <img
                                        className="text-xs w-12 h-auto mx-10"
                                        src="https://www.chess.com/bundles/web/images/color-icons/computer.f36f0d84.svg"
                                        alt="chess_comp_img"
                                    />
                                    <div className="grow my-5">
                                        <p className="text-5xl mb-2 ">Play Computer</p>
                                        <div className="text-base mt-1 ">Play vs Stockfish</div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="flex justify-center m-10">
                    <div className="mr-40 flex flex-col justify-center items-center ">
                        <p className="text-5xl mt-20">Solve Chess Puzzles</p>
                        <div className="text-4xl my-auto bg-gray-200 rounded-2xl p-4">
                            <p>Solve Puzzles</p>
                        </div>
                        <div className="flex">
                            <img
                                className="mr-20 h-[14.8rem] rounded-xl"
                                src="https://www.chess.com/bundles/web/images/faces/hikaru-nakamura.e1ca9267.jpg"
                                alt="hikaru_staring"
                            />
                            <div className="flex flex-col justify-center ">
                                <p className=" mb-3 text-xl">
                                    "Puzzles are the best way to
                                    <br /> improve pattern recognition, and
                                    <br /> no site does it better."
                                </p>
                                <div className="flex ">
                                    <div className="mr-5 w-11 text-center p-1 rounded-xl bg-[#7c2929] text-white">GM</div>
                                    <div className="text-2xl">Hikaru Nakamura</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <img className=" max-w-[40rem] w-[40rem]" src="./src/assets/images/board_img.png" alt="smaple_puzzle_img" />
                </div>
                <div className="flex justify-center m-10">
                    <img className="mr-40  max-w-[40rem] w-[40rem]" src="./src/assets/images/board_img.png" alt="smaple_puzzle_img" />
                    <div className=" flex flex-col justify-center items-center ">
                        <p className="text-5xl mt-20">Take Chess Lessons</p>
                        <div className="text-4xl m-auto bg-gray-200 rounded-2xl p-4">
                            <p>Start Lessons</p>
                        </div>
                        <div className="flex">
                            <img
                                className="mr-20 h-[14.8rem] rounded-xl"
                                src="https://www.chess.com/bundles/web/images/faces/anna-rudolf.193d08a5.jpg"
                                alt="anna_Rudolf"
                            />
                            <div className="flex flex-col justify-center ">
                                <p className=" mb-3 text-xl">
                                    "Chess.com lessons make it easy to
                                    <br /> learn to play, then challenge you to
                                    <br /> continue growing."
                                </p>
                                <div className="flex ">
                                    <div className="mr-5 w-11 text-center p-1 rounded-xl bg-[#7c2929] text-white">IM</div>
                                    <div className="text-2xl">Anna Rudolf</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
