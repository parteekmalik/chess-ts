import { Chess, DEFAULT_POSITION } from "chess.js";
import { Tboard_data } from "../../modules/board/board";
import { IComputerContextActions } from "./ComputerReducer";
import { createContext } from "react";


export interface ICommonContextState {
    board_data: Tboard_data;
    game: Chess;
}

export interface IComputerContextState extends ICommonContextState {
    type: "Computer";
}
export const defaultComputerContextState: IComputerContextState = {
    game: new Chess(),
    board_data: {
        board_layout: DEFAULT_POSITION,
        curMove: 1,
        onMove: 1,
        flip: "w",
        selectedPiece: "",
        lastMove: undefined,
        solveFor: "w",
    },
    type: "Computer",
};

export interface IComputerContextProps {
    ComputerState: IComputerContextState;
    ComputerDispatch: React.Dispatch<IComputerContextActions>;
}

const ComputerContext = createContext<IComputerContextProps>({
    ComputerState: defaultComputerContextState,
    ComputerDispatch: () => {},
});

export const PageContextConsumer = ComputerContext.Consumer;
export const ComputerContextProvider = ComputerContext.Provider;

export default ComputerContext;
