import React, { PropsWithChildren, useContext, useEffect, useReducer, useRef, useState } from "react";
import { useSocket } from "../../hooks/useSocket";
import { defaultSocketContextState, SocketContextProvider } from "./SocketContext";
import { useParams } from "react-router-dom";
import { SocketReducer } from "./SocketReducer";
import PageContext from "../page/PageContext";
import moment from "moment";
import axios, { getAdapter } from "axios";
import { getLastElement, getTimeTillMove } from "../../modules/Utils";

export interface ISocketContextComponentProps extends PropsWithChildren {}

async function makeHttpRequest(url: string): Promise<any> {
    try {
        const response = await axios.get(url);
        // You can handle the response data here
        console.log("Response data:", response.data);
        return response.data;
    } catch (error) {
        // Handle errors
        console.error("Error:", (error as Error).message);
        throw error;
    }
}
const SocketContextComponent: React.FunctionComponent<ISocketContextComponentProps> = (props) => {
    const { children } = props;

    const socket = useSocket("ws://localhost:1337", {
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        autoConnect: false,
    });
    const { PageState, PageDispatch } = useContext(PageContext);
    const { matchid } = useParams();

    const [SocketState, SocketDispatch] = useReducer(SocketReducer, defaultSocketContextState);
    const [loading, setLoading] = useState(true);

    /** Incrementing time */
    useEffect(() => {
        if (SocketState.match_details.game_stats != "") return;
        let interval: number;
        if (SocketState.match_prev_details.movesTime.length % 2 === 1) interval = setInterval(() => SocketDispatch({ type: "update_time", payload: "w" }), 10);
        else interval = setInterval(() => SocketDispatch({ type: "update_time", payload: "b" }), 10);
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [SocketState.match_prev_details.movesTime]);

    useEffect(() => {
        if (loading) {
            socket.connect();
            SocketDispatch({ type: "update_socket", payload: [socket, matchid as string] });
            StartListeners();
            SendHandshake();
            window.addEventListener(
                "keydown",
                (e) => {
                    e.preventDefault();
                    console.log(e);
                    if (e.key === "ArrowLeft") SocketDispatch({ type: "prevMove", payload: null });
                    else if (e.key === "ArrowRight") SocketDispatch({ type: "nextMove", payload: null });
                },
                false
            );
        }
        setLoading(false);
        // eslint-disable-next-line
    }, []);

    const StartListeners = () => {
        /** Messages */
        socket.on("recieved_move", (msg) => {
            SocketDispatch({ type: "recived_move", payload: msg });
        });
        /** Messages */
        socket.on("recieved_matchdetails", (msg) => {
            SocketDispatch({ type: "init_match", payload: msg });
        });
    };

    const SendHandshake = () => {
        console.info("Sending handshake to server ...");
        // SocketEmiter("handshake", {});
        SocketState.SocketEmiter("handshake", { uid: PageState.uid as string, matchid: matchid as string });
    };

    return (
        <>
            {loading ? (
                <p>... loading Socket IO ....</p>
            ) : (
                <SocketContextProvider value={{ SocketState, SocketDispatch }}>{children}</SocketContextProvider>
            )}
        </>
    );
};

export default SocketContextComponent;
