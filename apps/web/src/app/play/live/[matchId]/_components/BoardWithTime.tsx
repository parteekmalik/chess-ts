import type { UserProps } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { Card, CardBody, Link, User } from "@nextui-org/react";
import moment from "moment";
import { twMerge } from "tailwind-merge";

import type { BoardProps } from "~/modules/board/board";
import Board from "~/modules/board/board";
import MovesDisplay from "./MovesDisplay";
import SidebarTabs from "./SidebarTabs";

interface BoardWithTimeProps extends BoardProps {
  whitePlayerTime: number;
  blackPlayerTime: number;
  isWhiteTurn: boolean;
  disabled?: boolean;
}
export interface ChatMessageType {
  id: string;
  messgae: string;
}
function BoardWithTime(props: BoardWithTimeProps) {
  const [whiteTime, setWhiteTime] = useState(0);
  const [blackTime, setBlackTime] = useState(0);
  const [chatMessages, setchatMessages] = useState<ChatMessageType[]>([]);

  useEffect(() => {
    setWhiteTime(Math.max(props.whitePlayerTime, 0));
    setBlackTime(Math.max(props.blackPlayerTime, 0));

    const worker = new Worker(new URL("~/workers/timer.worker.ts", import.meta.url));

    worker.postMessage({
      isWhiteTurn: props.isWhiteTurn,
      whiteTime: props.whitePlayerTime,
      blackTime: props.blackPlayerTime,
    });

    worker.onmessage = (e) => {
      const { whiteTime: newWhiteTime, blackTime: newBlackTime } = e.data as { whiteTime: number; blackTime: number };
      setWhiteTime(Math.max(newWhiteTime, 0));
      setBlackTime(Math.max(newBlackTime, 0));
    };

    return () => worker.terminate(); // Cleanup on unmount
  }, [props.whitePlayerTime, props.blackPlayerTime, props.isWhiteTurn]);

  return (
    <div className="flex grow justify-between px-4">
      <div className="flex flex-col gap-2">
        <Board
          initalFlip={props.initalFlip}
          handleMove={props.handleMove}
          gameState={props.gameState}
          whiteBar={<TimerContainer variant="white" time={whiteTime} userDetails={defaultUserDetails} />}
          blackBar={<TimerContainer variant="black" time={blackTime} userDetails={defaultUserDetails} />}
        />
      </div>
      <SidebarTabs disabled={props.disabled} tabContents={{ play: <MovesDisplay chatMessages={chatMessages} /> }} />
    </div>
  );
}
const defaultUserDetails = {
  name: "Junior Garcia",
  description: (
    <Link href="https://twitter.com/jrgarciadev" size="sm" isExternal>
      @jrgarciadev
    </Link>
  ),
  avatarProps: {
    radius: "sm" as const,
    src: "https://avatars.githubusercontent.com/u/30373425?v=4",
  },
};
const TimerContainer = ({ variant, time, userDetails }: { variant: "white" | "black"; time: number; userDetails: UserProps }) => {
  return (
    <Card>
      <CardBody className="w-full flex-row justify-between">
        <User {...userDetails} />
        <TimerComponent time={time} variant={variant} />
      </CardBody>
    </Card>
  );
};

const TimerComponent = ({ time, variant }: { time: number; variant: "white" | "black" }) => {
  return (
    <div
      className={twMerge(
        "flex w-fit items-center justify-center rounded-md px-2 py-1 text-center font-mono",
        variant === "white" ? "bg-white text-black" : "bg-slate-600 text-white",
      )}
    >
      {String(moment.duration(time).hours()).padStart(2, "0")}:{String(moment.duration(time).minutes()).padStart(2, "0")}:
      {String(moment.duration(time).seconds()).padStart(2, "0")}.{String(moment.duration(time).milliseconds()).padStart(3, "0")}
    </div>
  );
};

export default BoardWithTime;
