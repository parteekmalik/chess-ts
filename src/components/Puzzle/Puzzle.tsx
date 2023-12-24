import axios from "axios";
import { Chess } from "chess.js";
import React, { useContext, useEffect, useState } from "react";
import PuzzleContext, { Tpuzzle } from "../../contexts/puzzle/PuzzleContext";
import PageContext from "../../contexts/page/PageContext";
import PuzzleBoard from "./PuzzleBoard";
import Board from "../../modules/board/boardMain";

const wrongurl = "https://www.chess.com/bundles/web/images/svg/wrong.svg";
const wrighturl = "https://www.chess.com/bundles/web/images/svg/solved.svg";

function Puzzle() {
    const { PuzzleState, PuzzleDispatch } = useContext(PuzzleContext);
    const { PageState, PageDispatch } = useContext(PageContext);

    function handleClick(payload: { from: string; to: string } | string) {
        if (PuzzleState.board_data.curMove === PuzzleState.board_data.onMove) PuzzleDispatch({ type: "move_piece", payload });
    }
    return (
        <div className="flex w-full">
            <div className="flex flex-col w-[50%]">
                <h2>Socket IO Information:</h2>
                {Object.entries({ ...PuzzleState, ...PageState }).map(([key, value]) => {
                    return !["socket", "game", "puzzleList"].includes(key) ? (
                        <div key={key}>
                            {key}: {JSON.stringify(value)}
                        </div>
                    ) : null;
                })}
                <div className="flex w-[500px] flex-wrap gap-5">
                    {PuzzleState.game.moves().map((m) => (
                        <div
                            className=" p-2 bg-slate-500 text-white"
                            onClick={() => {
                                // SocketEmiter("move_sent", m);
                                handleClick(m);
                            }}
                            key={m}
                        >
                            {m}
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex">
                <Board State={PuzzleState} StateDispatch={PuzzleDispatch} />
                <div className="flex h-full gap-5 w-[500px] flex-wrap border p-5">
                    {PuzzleState.puzzleList.map((puz, index) => {
                        if (PuzzleState.puzzleNo > index) {
                            // console.log(PuzzleState.puzzleNo, "  -> ", index);
                            return (
                                <div className="flex flex-col gap-2" key={puz.id}>
                                    <img className={`flex h-[18px] w-[18px]  text-[]`} src={`${puz.solved ? wrighturl : wrongurl}`}></img>
                                    <p>{puz.rating}</p>
                                </div>
                            );
                        }
                    })}
                </div>
            </div>
        </div>
    );
}

export default Puzzle;
