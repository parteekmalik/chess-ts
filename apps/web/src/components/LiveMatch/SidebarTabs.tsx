"use client";

import { MatchResult, MatchStatus } from "@acme/anchor";
import { Card, CardContent } from "@acme/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@acme/ui/tabs";

import { useBoard } from "../contexts/Board/BoardContextComponent";
import { MovesDisplay } from "./MovesDisplay";
import { NewMatch } from "./NewMatch";

function SidebarTabs() {
  const { gameData, sideBar, layout } = useBoard();
  const height = `calc(100vh - 3rem ${layout?.boardHeightOffset ? "- " + layout.boardHeightOffset + "px" : ""})`;

  const disabled = gameData && gameData.status === MatchStatus.Active && gameData.result === MatchResult.Pending && gameData.iAmPlayer;
  return (
    <Card className="w-full bg-background lg:max-w-[450px]">
      <CardContent className="max-h-full p-0">
        <Tabs className="w-full" defaultValue="play" style={{ height }}>
          <TabsList indicatorClassName="bg-primary/70" className="m-0 w-full bg-black/15 p-0">
            <TabsTrigger className="h-16 flex-1 flex-col dark:data-[state=active]:text-white" value="play">
              <span className="font-chess text-2xl" style={{ lineHeight: "1.5rem" }}>
                {"\u1F1D"}
              </span>
              <span>Play</span>
            </TabsTrigger>
            <TabsTrigger className="h-16 flex-1 flex-col dark:data-[state=active]:text-white" value="new_game" disabled={!!disabled}>
              <span className="font-chess text-2xl" style={{ lineHeight: "1.5rem" }}>
                {"\u1F01"}
              </span>
              <span>New Game</span>
            </TabsTrigger>
            <TabsTrigger className="h-16 flex-1 flex-col dark:data-[state=active]:text-white" value="games">
              <span className="font-chess text-2xl" style={{ lineHeight: "1.5rem" }}>
                {"\u2019"}
              </span>
              <span>Games</span>
            </TabsTrigger>
            <TabsTrigger className="h-16 flex-1 flex-col dark:data-[state=active]:text-white" value="players">
              <span className="font-chess text-2xl" style={{ lineHeight: "1.5rem" }}>
                {"\u006E"}
              </span>
              <span>Players</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="play">
            <MovesDisplay />
          </TabsContent>
          <TabsContent value="new_game" className="p-4">
            <NewMatch />
          </TabsContent>
          <TabsContent value="games">{sideBar?.matches}</TabsContent>
          <TabsContent value="players">{sideBar?.players}</TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default SidebarTabs;
