"use client";
import { Card, CardContent } from '@acme/ui/card';
import React, { useEffect } from 'react'
import { twMerge } from "tailwind-merge";
import moment from 'moment';
import { UserCard } from '~/components/userCard';

export const TimerContainer = ({ variant, isTurn, time, userId }: { variant: "white" | "black"; time: number; userId?: string, isTurn: boolean }) => {
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
  return (
    <Card className='border-0'>
      <CardContent className="flex w-full justify-between p-3">
        <UserCard userId={userId} />
        <TimerComponent time={liveTimeLeft} variant={variant} />
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