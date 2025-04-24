import React from "react";

import { convertMsToTime } from "../../Utils";

interface BannerProps {
  data: { name: string; time?: number };
}
const Banner: React.FC<BannerProps> = (props) => {
  const { name, time } = props.data;
  return (
    <div className="flex">
      <div className="flex text-2xl">
        <img className="h-10 w-10" src="http://localhost:5173/src/assets/images/bp.png" alt="opponent"></img>
        {name}
      </div>
      {time !== undefined ? <div className="m-3 ml-auto rounded bg-green-500 px-4 py-2 font-bold text-white">{convertMsToTime(time)}</div> : null}
    </div>
  );
};

export default Banner;
