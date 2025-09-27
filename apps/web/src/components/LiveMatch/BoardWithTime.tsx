"use client";

import { useMemo } from "react";

import { calculateTimeLeft } from "@acme/lib";

import type { BoardProps } from "~/components/board/board";
import type { BoardContextProps } from "~/components/contexts/Board/BoardContextComponent";
import { ChessBoardWrapper } from "~/components/board/board";
import { BoardProvider } from "~/components/contexts/Board/BoardContextComponent";
import SidebarTabs from "./SidebarTabs";
import { TimerContainer } from "./TimeContainerBar";

interface BoardWithTimeProps extends BoardProps, BoardContextProps {
  whitePlayerData?: { id?: string };
  blackPlayerData?: { id?: string };
}
export interface ChatMessageType {
  id: string;
  messgae: string;
}
export function BoardWithTime(props: BoardWithTimeProps) {
  // const [chatMessages, setchatMessages] = useState<ChatMessageType[]>([]);
  const playerTimes = useMemo(
    () =>
      props.gameData
        ? calculateTimeLeft(
            { baseTime: props.gameData.baseTime, incrementTime: props.gameData.incrementTime },
            [props.gameData.startedAt].concat(props.gameData.moves.map((move) => move.ts)),
          )
        : { w: 5 * 60 * 1000, b: 5 * 60 * 1000 },
    [props.gameData],
  );

  return (
    <BoardProvider {...props}>
      <div className="flex grow flex-col justify-between gap-4 lg:flex-row lg:p-4">
        <ChessBoardWrapper
          whiteBar={
            <TimerContainer
              variant="white"
              isTurn={props.gameData ? props.gameData.moves.length % 2 === 0 : false}
              time={playerTimes.w}
              userId={props.whitePlayerData?.id}
            />
          }
          blackBar={
            <TimerContainer
              variant="black"
              isTurn={props.gameData ? props.gameData.moves.length % 2 === 1 : false}
              time={playerTimes.b}
              userId={props.blackPlayerData?.id}
            />
          }
        />
        <SidebarTabs />
      </div>
    </BoardProvider>
  );
}
