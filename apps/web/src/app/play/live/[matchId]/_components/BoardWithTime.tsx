import { useState } from "react";
import type { BoardProps } from "~/components/board/board";
import { ChessBoardWrapper } from "~/components/board/board";
import SidebarTabs from "./SidebarTabs";
import { TimerContainer } from "./TimeContainerBar";

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
export function BoardWithTime(props: BoardWithTimeProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [chatMessages, setchatMessages] = useState<ChatMessageType[]>([]);

  return (
    <div className="flex grow flex-col justify-between gap-4 px-4 lg:flex-row">
      <ChessBoardWrapper
        initalFlip={props.initalFlip}
        handleMove={props.handleMove}
        gameState={props.gameState}
        whiteBar={<TimerContainer variant="white" isTurn={props.isWhiteTurn} time={props.whitePlayerData.time} userId={props.whitePlayerData.id} />}
        blackBar={<TimerContainer variant="black" isTurn={!props.isWhiteTurn} time={props.blackPlayerData.time} userId={props.blackPlayerData.id} />}
      />
      <SidebarTabs disabled={props.disabled} />
    </div>
  );
}
