import { Card, CardContent } from "@acme/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@acme/ui/tabs";

import MovesDisplay from "./MovesDisplay";
import NewMatch from "./NewMatch";

function SidebarTabs({ disabled = false }: { disabled?: boolean }) {
  return (
    <Card className="w-full max-w-[450px]">
      <CardContent className="p-0">
        <Tabs className="w-full" defaultValue={disabled ? "play" : "new_game"}>
          <TabsList className="mx-2 mb-4 mt-4 w-[calc(100%-1rem)]">
            <TabsTrigger className="flex-1" value="play">
              Play
            </TabsTrigger>
            {!disabled && <TabsTrigger value="new_game">New Game</TabsTrigger>}
            <TabsTrigger className="flex-1" value="games">
              Games
            </TabsTrigger>
            <TabsTrigger className="flex-1" value="players">
              Players
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
