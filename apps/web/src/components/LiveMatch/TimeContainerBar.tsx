"use client";

import React, { useEffect } from "react";
import moment from "moment";

import { cn } from "@acme/ui";
import { Card, CardContent } from "@acme/ui/card";

import { useBoard } from "~/components/contexts/Board/BoardContextComponent";
import { UserCard } from "~/components/userCard";

export const TimerContainer = ({ variant, isTurn, time, userId }: { variant: "white" | "black"; time: number; userId?: string; isTurn: boolean }) => {
  const [liveTimeLeft, setLiveTimeLeft] = React.useState(0);
  const { result } = useBoard();

  useEffect(() => {
    if (isTurn && result?.winner === "PLAYING") {
      const worker = new Worker(new URL("~/workers/timer.worker.ts", import.meta.url));
      worker.postMessage({ time });
      worker.onmessage = (e) => {
        const newTime = e.data as number;
        setLiveTimeLeft(Math.max(newTime, 0));
      };
      return () => worker.terminate();
    }
  }, [time, isTurn, result]);

  useEffect(() => {
    setLiveTimeLeft(time);
  }, [time]);

  return (
    <Card className="border-0 bg-inherit">
      <CardContent className="flex w-full justify-between p-0">
        <UserCard userId={userId} />
        <TimerComponent time={liveTimeLeft} variant={variant} isTurn={isTurn} />
      </CardContent>
    </Card>
  );
};

const TimerComponent = ({ time, variant, isTurn }: { time: number; variant: "white" | "black"; isTurn: boolean }) => {
  time = Math.max(time, 0);
  const isHour = time > 3600000;
  const isMicroSec = time < 30000;
  const hour = isHour && <span>{String(moment.duration(time).hours())}:</span>;
  const minute = isHour ? (
    <span>{String(moment.duration(time).minutes()).padStart(2, "0")}</span>
  ) : (
    <span>{String(moment.duration(time).minutes())}</span>
  );
  const seconds = <span>{String(moment.duration(time).seconds()).padStart(2, "0")}</span>;
  const milliseconds = isMicroSec && <span>.{String(Math.floor(moment.duration(time).milliseconds() / 1000))}</span>;
  return (
    <div className={!isTurn ? "opacity-30" : ""}>
      <div
        className={cn(
          "flex w-[165px] items-center justify-between rounded-md px-3 py-1",
          variant === "white" ? "bg-white text-black" : "bg-black fill-white text-white",
          isTurn && isMicroSec && "fill-red-400 text-red-400",
        )}
      >
        <ClockSvg isTurn={isTurn} />
        <p className={cn("ml-auto text-2xl")} style={{ fontFamily: "monospace" }}>
          {hour}
          {minute}:{seconds}
          {milliseconds}
        </p>
      </div>
    </div>
  );
};

const ClockSvg = ({ isTurn }: { isTurn: boolean }) => {
  const { result } = useBoard();
  const [rotation, setRotation] = React.useState(0);
  useEffect(() => {
    if (isTurn && result?.winner === "PLAYING") {
      const interval = setInterval(() => {
        setRotation((prev) => prev + 90);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setRotation(0);
    }
  }, [isTurn, result]);

  if (isTurn)
    return (
      <div>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" style={{ transform: `rotate(${rotation}deg)` }}>
          <path d="M5.48,9a.93.93,0,0,0-.3.71v.58a.94.94,0,0,0,.3.71,1,1,0,0,0,.71.3h4.58a1,1,0,0,0,.71-.3.94.94,0,0,0,.29-.71V9.7A.92.92,0,0,0,11.48,9a1,1,0,0,0-.71-.27H6.19A1,1,0,0,0,5.48,9Z"></path>
          <path d="M19.22,6.1a9.9,9.9,0,0,0-2.14-3.18A10.23,10.23,0,0,0,13.9.78,9.76,9.76,0,0,0,10,0,9.86,9.86,0,0,0,6.1.78,10,10,0,0,0,.78,6.1,9.81,9.81,0,0,0,0,10a9.81,9.81,0,0,0,.78,3.9A10,10,0,0,0,6.1,19.22,9.86,9.86,0,0,0,10,20a9.76,9.76,0,0,0,3.89-.78,10.23,10.23,0,0,0,3.18-2.14,9.9,9.9,0,0,0,2.14-3.18A9.81,9.81,0,0,0,20,10,9.81,9.81,0,0,0,19.22,6.1ZM17.07,13a7.65,7.65,0,0,1-1.65,2.42A7.81,7.81,0,0,1,13,17.06a7.46,7.46,0,0,1-3,.6,7.51,7.51,0,0,1-3-.6,7.74,7.74,0,0,1-2.43-1.65A8,8,0,0,1,2.94,13a7.46,7.46,0,0,1-.6-3,7.46,7.46,0,0,1,.6-3A8,8,0,0,1,4.58,4.59,7.74,7.74,0,0,1,7,2.94a7.51,7.51,0,0,1,3-.6,7.45,7.45,0,0,1,3,.6,7.74,7.74,0,0,1,2.43,1.65A7.65,7.65,0,0,1,17.07,7a7.46,7.46,0,0,1,.6,3A7.46,7.46,0,0,1,17.07,13Z" />
        </svg>
      </div>
    );
};
