import React, { PropsWithChildren, useContext, useEffect, useReducer, useRef, useState } from "react";
import { useSocket } from "../../hooks/useSocket";
import { defaultSocketContextState, SocketContextProvider } from "./SocketContext";
import { useParams } from "react-router-dom";
import { SocketReducer } from "./SocketReducer";
import PageContext from "../page/PageContext";
import moment from "moment";
import axios, { getAdapter } from "axios";
import { Color } from "chess.js";

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
        if (SocketState.movesData.length % 2 === 1) interval = setInterval(() => SocketDispatch({ type: "update_time", payload: "w" }), 10);
        else interval = setInterval(() => SocketDispatch({ type: "update_time", payload: "b" }), 10);
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [SocketState.movesData]);

    useEffect(() => {
        SocketDispatch({ type: "update_board_data", payload: SocketState.board_data.curMove });
    }, [SocketState.board_data.curMove]);

    useEffect(() => {
        if (loading) {
            socket.connect();
            SocketDispatch({ type: "update_socket", payload: [socket, matchid as string] });
            StartListeners();

            SendHandshake(); // Wait for the handshake to complete before proceeding.

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
            const mySide: Color = PageState.uid === msg.whiteId ? "w" : "b";
            SocketDispatch({ type: "init_match", payload: { ...msg, mySide } });
        });
    };

    const SendHandshake = async () => {
        console.info("Sending handshake to server ...");
        SocketEmiter("handshake", { uid: PageState.uid as string, matchid: matchid as string });
    };
    function SocketEmiter(type: string, payload: any) {
        console.info("Emitted - Action: " + type + " - Payload: ", payload);
        socket.emit(type, payload);
        return true;
    }
    return (
        <>
            {loading ? (
                <p>... loading Socket IO ....</p>
            ) : (
                <SocketContextProvider value={{ SocketState, SocketDispatch, SocketEmiter }}>{children}</SocketContextProvider>
            )}
        </>
    );
};

export default SocketContextComponent;
