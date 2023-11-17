import React, { PropsWithChildren, useEffect, useReducer, useRef, useState } from "react";
import { defaultPageContextState, PageContextProvider, PageReducer } from "./PageContext";

export interface IPageContextComponentProps extends PropsWithChildren {}

const PageContextComponent: React.FunctionComponent<IPageContextComponentProps> = (props) => {
    const { children } = props;

    const [PageState, PageDispatch] = useReducer(PageReducer, defaultPageContextState);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(false);
        // eslint-disable-next-line
    }, []);

    return (
        <>{loading ? <p>... loading Page IO ....</p> : <PageContextProvider value={{ PageState, PageDispatch }}>{children}</PageContextProvider>}</>
    );
};

export default PageContextComponent;
