import React, { useContext, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Square } from "chess.js";
import SocketContext from "../../contexts/socket/SocketContext";
import PageContext from "../../contexts/page/PageContext";
import Board from "../../modules/board/boardMain";

export interface ILiveBoardProps {}

const LiveBoard: React.FunctionComponent<ILiveBoardProps> = (props) => {
    const navigate = useNavigate();
    const { SocketState, SocketDispatch } = useContext(SocketContext);
    const { PageState, PageDispatch } = useContext(PageContext);
    useEffect(() => {
        if (PageState.uid === null) {
            console.log("PageContext", PageState.uid);

            navigate("/login");
        }
    }, []);

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
                    {SocketState.game.turn() === SocketState.board_data.solveFor &&
                        SocketState.game.moves().map((m) => (
                            <div
                                className=" p-2 bg-slate-500 text-white"
                                onClick={() => {
                                    SocketDispatch({ type: "move_piece", payload: m });
                                }}
                                key={m}
                            >
                                {m}
                            </div>
                        ))}
                </div>
            </div>
            <Board State={SocketState} StateDispatch={SocketDispatch} />
        </div>
    );
};

export default LiveBoard;
