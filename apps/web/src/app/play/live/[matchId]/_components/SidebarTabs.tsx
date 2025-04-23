import type { ReactNode } from "react";

import { Card, CardContent } from "@acme/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@acme/ui/tabs";

import NewMatch from "./NewMatch";

function SidebarTabs({ tabContents, disabled = false }: { tabContents?: Record<string, ReactNode>; disabled?: boolean }) {
  return (
    <Card>
      <CardContent>
        <Tabs>
          <TabsList defaultValue={disabled ? "play" : "new game"}>
            <TabsTrigger value="play">Play</TabsTrigger>
            <TabsTrigger value="new game" disabled={disabled}>
              New Game
            </TabsTrigger>
            <TabsTrigger value="games">Games</TabsTrigger>
            <TabsTrigger value="players">Players</TabsTrigger>
          </TabsList>
          <TabsContent value="play">{tabContents?.play}</TabsContent>
          <TabsContent value="new game">
            <NewMatch />
          </TabsContent>
          <TabsContent value="games">{/* Content for games tab */}</TabsContent>
          <TabsContent value="players">{/* Content for players tab */}</TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default SidebarTabs;
