import { useEffect, useState } from "react";
import Link from "next/link";
import moment from "moment";
import { twMerge } from "tailwind-merge";

import { Avatar, AvatarFallback, AvatarImage } from "@acme/ui/avatar";
import { Card, CardContent } from "@acme/ui/card";

import type { BoardProps } from "~/components/board/board";
import Board from "~/components/board/board";
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    <div className="flex grow justify-between gap-4 px-4">
      <div className="flex flex-col gap-2">
        <Board
          initalFlip={props.initalFlip}
          handleMove={props.handleMove}
          gameState={props.gameState}
          whiteBar={<TimerContainer variant="white" time={whiteTime} userDetails={defaultUserDetails} />}
          blackBar={<TimerContainer variant="black" time={blackTime} userDetails={defaultUserDetails} />}
        />
      </div>
      <SidebarTabs disabled={props.disabled} />
    </div>
  );
}
const defaultUserDetails = {
  name: "Junior Garcia",
  description: (
    <Link href="https://twitter.com/jrgarciadev" target="_blank">
      @jrgarciadev
    </Link>
  ),
  avatarProps: {
    radius: "sm" as const,
    src: "https://avatars.githubusercontent.com/u/30373425?v=4",
  },
};
const TimerContainer = ({ variant, time, userDetails }: { variant: "white" | "black"; time: number; userDetails: typeof defaultUserDetails }) => {
  const imageSrc = userDetails.avatarProps.src;
  const initials = userDetails.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Card>
      <CardContent className="flex w-full justify-between p-3">
        <div className="flex w-fit items-center gap-4 p-0">
          <Avatar>{imageSrc ? <AvatarImage src={imageSrc} alt={userDetails.name} /> : <AvatarFallback>{initials}</AvatarFallback>}</Avatar>
          <div>
            <p className="text-sm font-medium">{userDetails.name}</p>
            {userDetails.description}
          </div>
        </div>
        <TimerComponent time={time} variant={variant} />
      </CardContent>
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
