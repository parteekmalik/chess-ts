import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

import { Card, CardContent } from "@acme/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@acme/ui/tabs";

import { useTRPC } from "~/trpc/react";
import { MovesDisplay } from "./MovesDisplay";
import { NewMatch } from "./NewMatch";

function SidebarTabs() {
  const params = useParams();
  const trpc = useTRPC();
  const { data: session } = useSession();
  const { data: match } = useQuery(trpc.liveGame.getMatch.queryOptions(params.matchId as string, { enabled: params.matchId !== undefined }));
  const disabled =
    session == null ||
    (((match != null && match.stats?.winner == null) || (params.matchId && match?.stats?.winner === "PLAYING")) &&
      (session.user.id === match.whitePlayerId || session.user.id === match.blackPlayerId));

  return (
    <Card className="w-full bg-background lg:max-w-[450px]">
      <CardContent className="p-0">
        <Tabs className="w-full" defaultValue={params.matchId ? "play" : "new_game"}>
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
          <TabsContent value="games">{/* Content for games tab */}</TabsContent>
          <TabsContent value="players">{/* Content for players tab */}</TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default SidebarTabs;
