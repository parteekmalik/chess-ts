import { useEffect, useState } from "react";
import moment from "moment";
import { twMerge } from "tailwind-merge";

import { Card, CardContent } from "@acme/ui/card";

import type { BoardProps } from "~/components/board/board";
import Board from "~/components/board/board";
import { UserCard } from "~/components/userCard";
import SidebarTabs from "./SidebarTabs";

interface BoardWithTimeProps extends BoardProps {
  whitePlayerData: { time: number; id?: string };
  blackPlayerData: { time: number; id?: string };
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
    setWhiteTime(Math.max(props.whitePlayerData.time, 0));
    setBlackTime(Math.max(props.blackPlayerData.time, 0));

    const worker = new Worker(new URL("~/workers/timer.worker.ts", import.meta.url));

    worker.postMessage({
      isWhiteTurn: props.isWhiteTurn,
      whiteTime: props.whitePlayerData.time,
      blackTime: props.blackPlayerData.time,
    });

    worker.onmessage = (e) => {
      const { whiteTime: newWhiteTime, blackTime: newBlackTime } = e.data as { whiteTime: number; blackTime: number };
      setWhiteTime(Math.max(newWhiteTime, 0));
      setBlackTime(Math.max(newBlackTime, 0));
    };

    return () => worker.terminate(); // Cleanup on unmount
  }, [props.whitePlayerData.time, props.blackPlayerData.time, props.isWhiteTurn]);

  return (
    <div className="flex grow flex-col justify-between gap-4 px-4 lg:flex-row">
      <div className="flex flex-col gap-2">
        <Board
          initalFlip={props.initalFlip}
          handleMove={props.handleMove}
          gameState={props.gameState}
          whiteBar={<TimerContainer variant="white" time={whiteTime} userId={props.whitePlayerData.id} />}
          blackBar={<TimerContainer variant="black" time={blackTime} userId={props.blackPlayerData.id} />}
        />
      </div>
      <SidebarTabs disabled={props.disabled} />
    </div>
  );
}
const TimerContainer = ({ variant, time, userId }: { variant: "white" | "black"; time: number; userId?: string }) => {
  return (
    <Card>
      <CardContent className="flex w-full justify-between p-3">
        <UserCard userId={userId} />
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
