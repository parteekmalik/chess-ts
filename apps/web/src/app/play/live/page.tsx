"use client";

import { Chess } from "chess.js";

import BoardWithTime from "./[matchId]/_components/BoardWithTime";

function Online() {
  return (
    <div className="flex h-full justify-center p-2">
      <BoardWithTime
        whitePlayerData={{ time: 0 }}
        blackPlayerData={{ time: 0 }}
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
