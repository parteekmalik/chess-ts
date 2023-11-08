import React, { PropsWithChildren, useContext, useEffect, useReducer, useRef, useState } from "react";
import { useSocket } from "../../hooks/useSocket";
import { defaultSocketContextState, SocketContextProvider } from "./SocketContext";
import { useParams } from "react-router-dom";
import { SocketReducer } from "./SocketReducer";
import PageContext from "../page/PageContext";

export interface ISocketContextComponentProps extends PropsWithChildren {}

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

    useEffect(() => {
        socket.connect();
        SocketDispatch({ type: "update_socket", payload: [socket, matchid as string] });
        StartListeners();
        SendHandshake();
        setLoading(false);
        // eslint-disable-next-line
    }, []);

    const StartListeners = () => {
        /** Messages */
        socket.on("recieved_move", (msg) => {
            SocketDispatch({ type: "recived_move", payload: msg });
        });
        /** Messages */
        socket.on("recieved_matchdetails", (msg:{stats: {
            isover: boolean;
            reason: string;
            winner: string;
        };moves:string[];movesTime:string[];whitePlayerId:string;blackPlayerId:string;}) => {
            const {whitePlayerId,blackPlayerId} = msg;
            const [playerId,oponentId] = PageState.uid ===  whitePlayerId ? [whitePlayerId,blackPlayerId] : [blackPlayerId,whitePlayerId])
            SocketDispatch({ type: "init_match", payload: {playerId,oponentId,...msg} });
        });

    const SendHandshake = () => {
        console.info("Sending handshake to server ...");

        SocketEmiter("handshake", { uid: PageState.uid as string, matchid: matchid as string });
    };
    const SocketEmiter = (type: string, payload: any) => {
        console.info("Emitted - Action: " + type + " - Payload: ", payload);
        socket.emit(type, payload);
    };

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
