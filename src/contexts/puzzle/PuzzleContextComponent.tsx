import React, { PropsWithChildren, useContext, useEffect, useReducer, useRef, useState } from "react";
import axios, { getAdapter } from "axios";
import { getLastElement, getTimeTillMove } from "../../modules/Utils";
import { PuzzleContextProvider, PuzzleReducer, Tpuzzle, defaultPuzzleContextState } from "./PuzzleContext";
import PageContext from "../page/PageContext";
import { Chess } from "chess.js";

export interface IPuzzleContextComponentProps extends PropsWithChildren {}

const PuzzleContextComponent: React.FunctionComponent<IPuzzleContextComponentProps> = (props) => {
    const { children } = props;

    const { PageState, PageDispatch } = useContext(PageContext);

    const [loading, setLoading] = useState(true);
    const [PuzzleState, PuzzleDispatch] = useReducer(PuzzleReducer, defaultPuzzleContextState);
    const updatePuzzle = () => {
        const data = axios.get("http://localhost:3002/getpuzzles").then((data) => {
            const payload = data.data.map((data: any) => ({ ...data, solved: false } as Tpuzzle));
            PuzzleDispatch({ type: "update_puzzle_list", payload });
            PuzzleDispatch({ type: "update_puzzle", payload: 0 });
        });
    };
    useEffect(() => {
        if (loading) {
            updatePuzzle();
            window.addEventListener(
                "keydown",
                (e) => {
                    e.preventDefault();
                    console.log(e);
                    if (e.key === "ArrowLeft") PuzzleDispatch({ type: "prevMove", payload: null });
                    else if (e.key === "ArrowRight") PuzzleDispatch({ type: "nextMove", payload: null });
                },
                false
            );
        }
        setLoading(false);
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        const { game, curMove, onMove, puzzle } = PuzzleState;
        const nextMoveN = game.history().length;
        const nextMove = puzzle?.moves[nextMoveN];
        const iswrong = puzzle?.moves[nextMoveN - 1] !== PuzzleState.game.history()[nextMoveN - 1];

        console.log("nextMove -> ", nextMove);
        if (curMove === onMove && puzzle != undefined) {
            if (iswrong) {
                PuzzleDispatch({ type: "update_puzzle_result", payload: false });
                PuzzleDispatch({ type: "update_puzzle", payload: PuzzleState.puzzleNo + 1 });
            } else if (!nextMove) {
                console.log("completed Puzzle");
                PuzzleDispatch({ type: "update_puzzle_result", payload: true });
                PuzzleDispatch({ type: "update_puzzle", payload: PuzzleState.puzzleNo + 1 });
            } else if (onMove % 2 === 0) PuzzleDispatch({ type: "move_piece", payload: nextMove });
        }
    }, [PuzzleState.game.turn()]);

    return <>{loading ? <p>... loading Puzzle IO ....</p> : <PuzzleContextProvider value={{ PuzzleState, PuzzleDispatch }}>{children}</PuzzleContextProvider>}</>;
};

export default PuzzleContextComponent;
