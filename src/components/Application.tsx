import React, { useContext, useEffect, useRef } from "react";
import SocketContext from "../contexts/socket/SocketContext";
import { useNavigate, useParams } from "react-router-dom";
import Board from "../modules/board/board copy";
import PageContext from "../contexts/page/PageContext";

export interface IApplicationProps {}

const Application: React.FunctionComponent<IApplicationProps> = (props) => {
    const navigate = useNavigate();
    const { SocketState, SocketDispatch, SocketEmiter } = useContext(SocketContext);
    const { PageState, PageDispatch } = useContext(PageContext);
    useEffect(() => {
        if (PageState.uid === null) {
            console.log("PageContext", PageState.uid);

            navigate("/login");
        }
    }, []);
    function handleClick(payload: { from: string; to: string }) {
        SocketEmiter("move_sent", payload);
    }
    return (
        <div className="flex w-full">
            <div className="flex flex-col w-[50%]">
                <h2>Socket IO Information:</h2>
                {Object.entries({ ...SocketState, ...PageState }).map(([key, value]) => {
                    return key !== "socket" && key !== "game" ? (
                        <div key={key}>
                            {key}: {JSON.stringify(value)}
                        </div>
                    ) : null;
                })}
                <div className="flex flex-wrap gap-5">
                    {PageState.uid === (SocketState.game.turn() === "w" ? SocketState.whitePlayerId : SocketState.blackPlayerId) &&
                        SocketState.game.moves().map((m) => (
                            <div
                                className=" p-2 bg-slate-500 text-white"
                                onClick={() => {
                                    SocketEmiter("move_sent", m);
                                }}
                                key={m}
                            >
                                {m}
                            </div>
                        ))}
                </div>
            </div>
            <Board clickHandle={handleClick} />
        </div>
    );
};

export default Application;
