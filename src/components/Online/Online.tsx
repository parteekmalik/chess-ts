import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Board from "../../modules/board/board";
import Banner from "../../modules/banner/banner";
import { Chess } from "chess.js";

function Online() {
    const navigate = useNavigate();
    const [userName, setUserName] = useState("");
    const [selectedGameType, setSelectedGameType] = useState(10);

    const handleSubmit = (e: any) => {
        e.preventDefault();
        // localStorage.setItem("userName", userName);
        navigate("/live/12345/1/w");
    };
    return (
        <>
            <div className="flex justify-center items-center">
                <Board
                    game={new Chess()}
                    turn={"w"}
                    opponent={{ name: "opponent", time: 0 }}
                    player={{ name: "player", time: 0 }}
                    gameType={selectedGameType}
                />
            </div>
        </>
    );
}

export default Online;
