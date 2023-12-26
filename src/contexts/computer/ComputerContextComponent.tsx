import { PropsWithChildren, useContext, useEffect, useReducer, useState } from "react";
import PageContext from "../page/PageContext";
import { ComputerReducer } from "./ComputerReducer";
import { ComputerContextProvider, defaultComputerContextState } from "./ComputerContext";
import axios from "axios";
import { serverurl } from "../../URLs";

export interface IComputerContextComponentProps extends PropsWithChildren {}


const ComputerContextComponent: React.FunctionComponent<IComputerContextComponentProps> = (props) => {
    const { children } = props;

    const { PageState, PageDispatch } = useContext(PageContext);

    const [loading, setLoading] = useState(true);
    const [ComputerState, ComputerDispatch] = useReducer(ComputerReducer, defaultComputerContextState);

    useEffect(() => {
        if (loading) {
            window.addEventListener(
                "keydown",
                (e) => {
                    if (["ArrowLeft", "ArrowRight"].includes(e.key)) {
                        e.preventDefault();
                        console.log(e);
                        if (e.key === "ArrowLeft") ComputerDispatch({ type: "prevMove", payload: null });
                        else if (e.key === "ArrowRight") ComputerDispatch({ type: "nextMove", payload: null });
                    }
                },
                false
            );
        }
        setLoading(false);
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
    }, [ComputerState.game.turn()]);

    return <>{loading ? <p>... loading Computer IO ....</p> : <ComputerContextProvider value={{ ComputerState, ComputerDispatch }}>{children}</ComputerContextProvider>}</>;
};

export default ComputerContextComponent;
