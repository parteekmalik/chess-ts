"use client";

import { cn } from "@acme/ui";
import { Card, CardContent } from "@acme/ui/card";
import moment from "moment";
import React, { useEffect } from "react";
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
  const isHour = time > 3600000;
  const isMicroSec = time < 30000;
  return (
    <div
      className={cn(
        "w-[160px] rounded-md px-4 py-1 flex items-center",
        variant === "white" ? "bg-white text-black" : "bg-black text-white",
      )}
    >
      <p
        className={cn("ml-auto text-2xl",
          isTurn && isMicroSec && "text-red-400"
        )}
        style={{ letterSpacing: "0.0.8rem" }}
      >
        {isHour && String(moment.duration(time).hours()).padStart(2, "0") + ":"}
        {String(moment.duration(time).minutes()).padStart(2, "0")}:{String(moment.duration(time).seconds()).padStart(2, "0")}
        {isMicroSec && "." + String(moment.duration(time).milliseconds()).padStart(3, "0")}
      </p>
    </div>
  );
};
