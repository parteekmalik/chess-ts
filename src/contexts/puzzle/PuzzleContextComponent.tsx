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
            console.log(data.data);
            PuzzleDispatch({ type: "update_puzzle_list", payload: data.data as Tpuzzle[] });
        });
    };
    useEffect(() => {
        if (loading) {
            updatePuzzle();
        }
        setLoading(false);
        // eslint-disable-next-line
    }, []);
    useEffect(() => {
        const { game, solveFor, puzzle } = PuzzleState;
        const nextMoveN = game.history().length;
        const nextMove = puzzle?.moves[nextMoveN];
        const iswrong = puzzle?.moves[nextMoveN - 1] !== PuzzleState.game.history()[nextMoveN - 1];
        console.log("nextMove -> ", nextMove);
        if (game.turn() !== solveFor) {
            if (iswrong) {
                PuzzleDispatch({ type: "flag_wrong_move", payload: null });
            } else if (!nextMove) {
                console.log("completed Puzzle");
                PuzzleDispatch({ type: "update_puzzle", payload: PuzzleState.puzzleNo + 1 });
            } else PuzzleDispatch({ type: "move_piece", payload: nextMove });
        }
    }, [PuzzleState.game.turn()]);

    return <>{loading ? <p>... loading Socket IO ....</p> : <PuzzleContextProvider value={{ PuzzleState, PuzzleDispatch }}>{children}</PuzzleContextProvider>}</>;
};

export default PuzzleContextComponent;