import axios from "axios";
import { Chess } from "chess.js";
import React, { useContext, useEffect, useState } from "react";
import PuzzleContext, { Tpuzzle } from "../../contexts/puzzle/PuzzleContext";
import PageContext from "../../contexts/page/PageContext";
import PuzzleBoard from "./PuzzleBoard";

function Puzzle() {
    const { PuzzleState, PuzzleDispatch } = useContext(PuzzleContext);
    const { PageState, PageDispatch } = useContext(PageContext);

    
    function handleClick(payload: { from: string; to: string } | string) {
         PuzzleDispatch({ type: "move_piece", payload });
    }
    return (
        <div className="flex w-full">
            <div className="flex flex-col w-[50%]">
                <h2>Socket IO Information:</h2>
                {Object.entries({ ...PuzzleState, ...PageState }).map(([key, value]) => {
                    return key !== "socket" && key !== "game" ? (
                        <div key={key}>
                            {key}: {JSON.stringify(value)}
                        </div>
                    ) : null;
                })}
                <div className="flex flex-wrap gap-5">
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
            <PuzzleBoard clickHandle={handleClick} />
        </div>
    );
}

export default Puzzle;
