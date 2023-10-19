import React from "react";
import convertMsToplayerTime from "../convertMsToTime";

interface BannerProps {
    data: { name: string; time?: number;gameTime?: { baseTime: number, incrementTime: number } };
}
const Banner: React.FC<BannerProps> = (props) => {
    const { name, time,gameTime } = props.data;

    return (
        <div className="flex">
            <div className="flex text-2xl">
                <img className="w-10 h-10 " src="http://localhost:5173/src/assets/images/bp.png" alt="opponent"></img>
                {name}
            </div>
            {time !== undefined && gameTime !== undefined ? (
                <div className="m-3 ml-auto bg-green-500 text-white font-bold py-2 px-4 rounded">
                    {convertMsToplayerTime(60000 * gameTime.baseTime - time)}</div>
            ) : null}
        </div>
    );
};

export default Banner;
