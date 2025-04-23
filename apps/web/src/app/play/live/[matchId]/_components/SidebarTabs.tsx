import type { ReactNode } from "react";

import { Card, CardContent } from "@acme/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@acme/ui/tabs";

import NewMatch from "./NewMatch";

function SidebarTabs({ tabContents, disabled = false }: { tabContents?: Record<string, ReactNode>; disabled?: boolean }) {
  return (
    <Card>
      <CardContent>
        <Tabs defaultValue={disabled ? "play" : "new_game"}>
          <TabsList className="mt-4">
            <TabsTrigger value="play">Play</TabsTrigger>
            {!disabled && <TabsTrigger value="new_game">New Game</TabsTrigger>}
            <TabsTrigger value="games">Games</TabsTrigger>
            <TabsTrigger value="players">Players</TabsTrigger>
          </TabsList>
          <TabsContent value="play">{tabContents?.play}</TabsContent>
          <TabsContent value="new_game">
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
