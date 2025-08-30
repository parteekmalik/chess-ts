import type { Color } from "chess.js";

import type { BoardProps } from "~/components/board/board";
import type { BoardContextProps } from "~/components/contexts/Board/BoardContextComponent";
import { ChessBoardWrapper } from "~/components/board/board";
import { BoardProvider } from "~/components/contexts/Board/BoardContextComponent";
import SidebarTabs from "./SidebarTabs";
import { TimerContainer } from "./TimeContainerBar";

interface BoardWithTimeProps extends BoardProps, BoardContextProps {
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
    <BoardProvider
      gameState={props.gameState}
      initalFlip={props.initalFlip}
      handleMove={props.handleMove}
      reload={props.reload}
      result={props.result}
    >
      <div className="flex grow flex-col justify-between gap-4 lg:flex-row lg:p-4">
        <ChessBoardWrapper
          whiteBar={
            <TimerContainer variant="white" isTurn={props.turn === "w"} time={props.whitePlayerData.time} userId={props.whitePlayerData.id} />
          }
          blackBar={
            <TimerContainer variant="black" isTurn={props.turn === "b"} time={props.blackPlayerData.time} userId={props.blackPlayerData.id} />
          }
        />
        <SidebarTabs />
      </div>
    </BoardProvider>
  );
}
