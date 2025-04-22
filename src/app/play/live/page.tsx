"use client";
import { Card, CardBody, Tab } from "@nextui-org/react";
import { Tabs } from "@nextui-org/react";
import BoardWithTime from "./[matchId]/_components/BoardWithTime";
import NewMatch from "./[matchId]/_components/NewMatch";
import { useState } from "react";
import SidebarTabs from "./[matchId]/_components/SidebarTabs";
function Online() {

  return (
    <div className="flex h-full justify-center p-2">
      <BoardWithTime isWhiteTurn={true} whitePlayerTime={0} blackPlayerTime={0} handleMove={() => {console.log("move")}} movesPlayed={[]} playerTurn={null} />
      <SidebarTabs />
    </div>
  );
}

export default Online;
