"use client";

import React, { useEffect } from "react";
import moment from "moment";

import { cn } from "@acme/ui";
import { Card, CardContent } from "@acme/ui/card";

import { UserCard } from "~/components/userCard";

export const TimerContainer = ({ variant, isTurn, time, userId }: { variant: "white" | "black"; time: number; userId?: string; isTurn: boolean }) => {
  const [liveTimeLeft, setLiveTimeLeft] = React.useState(0);

  useEffect(() => {
    if (isTurn) {
      const worker = new Worker(new URL("~/workers/timer.worker.ts", import.meta.url));
      worker.postMessage({ time });
      worker.onmessage = (e) => {
        const newTime = e.data as number;
        setLiveTimeLeft(Math.max(newTime, 0));
      };
      return () => worker.terminate();
    }
  }, [time, isTurn]);

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
  const milliseconds = isMicroSec && <span>.{String(moment.duration(time).milliseconds()).padStart(3, "0")}</span>;
  return (
    <div className={!isTurn ? "opacity-80" : ""}>
      <div className={cn("flex w-[160px] items-center rounded-md px-4 py-1", variant === "white" ? "bg-white text-black" : "bg-black text-white")}>
        <p className={cn("ml-auto text-2xl", isTurn && isMicroSec && "text-red-400")} style={{ fontFamily: "monospace" }}>
          {hour}
          {minute}:{seconds}
          {milliseconds}
        </p>
      </div>
    </div>
  );
};
