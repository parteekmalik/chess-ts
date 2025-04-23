"use client";

import { Chess } from "chess.js";

import BoardWithTime from "./[matchId]/_components/BoardWithTime";

function Online() {
  return (
    <div className="flex h-full justify-center p-2">
      <BoardWithTime
        whitePlayerTime={1000}
        blackPlayerTime={1000}
        isWhiteTurn={true}
        gameState={new Chess()}
        handleMove={() => {
          console.log("move");
        }}
      />
    </div>
  );
}

export default Online;
