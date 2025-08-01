import type { BoardProps } from "~/components/board/board";
import { ChessBoardWrapper } from "~/components/board/board";
import SidebarTabs from "./SidebarTabs";
import { TimerContainer } from "./TimeContainerBar";
import { Color } from "chess.js";

interface BoardWithTimeProps extends BoardProps {
  whitePlayerData: { time: number; id?: string };
  blackPlayerData: { time: number; id?: string };
  turn?: Color;
}
export interface ChatMessageType {
  id: string;
  messgae: string;
}
export function BoardWithTime(props: BoardWithTimeProps) {
  // const [chatMessages, setchatMessages] = useState<ChatMessageType[]>([]);

  return (
    <div className="flex grow flex-col justify-between gap-4 lg:p-4 lg:flex-row">
      <ChessBoardWrapper
        initalFlip={props.initalFlip}
        handleMove={props.handleMove}
        gameState={props.gameState}
        whiteBar={<TimerContainer variant="white" isTurn={props.turn === "w"} time={props.whitePlayerData.time} userId={props.whitePlayerData.id} />}
        blackBar={<TimerContainer variant="black" isTurn={props.turn === "b"} time={props.blackPlayerData.time} userId={props.blackPlayerData.id} />}
      />
      <SidebarTabs />
    </div>
  );
}
