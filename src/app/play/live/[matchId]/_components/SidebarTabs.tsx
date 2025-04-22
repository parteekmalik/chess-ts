import { CardBody, Tab, Tabs } from '@nextui-org/react'
import { Card } from "@nextui-org/react";
import React, { type ReactNode, useState } from "react";
import NewMatch from './NewMatch';

function SidebarTabs({ tabContents }: { tabContents?: Record<string, ReactNode> }) {
  const [isSelectedOption, setIsSelectedOption] = useState("new game");

  return (
    <Card>
      <CardBody>
        <Tabs selectedKey={isSelectedOption} onSelectionChange={(key) => setIsSelectedOption(key.toString())} variant="solid" fullWidth size="lg">
          <Tab key="play" title="Play">
            {tabContents?.play}
          </Tab>
          <Tab key="new game" title="New Game">
            <NewMatch />
          </Tab>
          <Tab key="games" title="Games" />
          <Tab key="players" title="Players" />
        </Tabs>
      </CardBody>
    </Card>
  );
}

export default SidebarTabs;
