"use client";
import { Card, CardBody, Tab } from "@nextui-org/react";
import { Tabs } from "@nextui-org/react";
import BoardWithTime from "./[matchId]/_components/BoardWithTime";
import NewMatch from "./[matchId]/_components/NewMatch";
import { useState } from "react";
function Online() {
  const [isSelectedoption, setIsSelectedoption] = useState("new game");

  return (
    <div className="flex h-full justify-center p-2">
      <BoardWithTime isWhiteTurn={true} whitePlayerTime={0} blackPlayerTime={0} handleMove={() => {console.log("move")}} movesPlayed={[]} playerTurn={null} />
      <Card>
        <CardBody>
          <Tabs
            selectedKey={isSelectedoption}
            onSelectionChange={(key) => setIsSelectedoption(key.toString())}
            variant="solid"
            fullWidth
            size="lg"
          >
            <Tab key="new game" title="New Game">
              <NewMatch />
            </Tab>
            <Tab key="games" title="Games" />
          <Tab key="players" title="Players" />
          </Tabs>
        </CardBody>
      </Card>
    </div>
  );
}

export default Online;
