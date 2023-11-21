import React, { useContext } from "react";
import convertMsToplayerTime from "../convertMsToTime";
import SocketContext from "../../contexts/socket/SocketContext";
import moment from "moment";
import { getLastElement } from "../Utils";

interface BannerProps {
    data: { name: string; time?: number };
}
const Banner: React.FC<BannerProps> = (props) => {
    const { name, time } = props.data;
    const { movesTime } = useContext(SocketContext).SocketState;
    return (
        <div className="flex">
            <div className="flex text-2xl">
                <img className="w-10 h-10 " src="http://localhost:5173/src/assets/images/bp.png" alt="opponent"></img>
                {name}
            </div>
            {time !== undefined && time !== undefined ? (
                <div className="m-3 ml-auto bg-green-500 text-white font-bold py-2 px-4 rounded">
                    {convertMsToplayerTime(time )}
                </div>
            ) : null}
        </div>
    );
};

export default Banner;
