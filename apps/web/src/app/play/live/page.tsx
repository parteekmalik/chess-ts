"use client";

import { Chess } from "chess.js";

import { BoardWithTime } from "~/components/LiveMatch/BoardWithTime";

function Online() {
  return (
    <div className="flex h-full justify-center p-2">
      <BoardWithTime whitePlayerData={{ time: 5 * 60 * 1000 }} blackPlayerData={{ time: 5 * 60 * 1000 }} gameState={new Chess()} />
    </div>
  );
}

export default Online;
