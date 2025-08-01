import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import type { NOTIFICATION_PAYLOAD } from "@acme/lib/WStypes/typeForFrontendToSocket";
import { gameTypes } from "@acme/lib";
import { cn } from "@acme/ui";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@acme/ui/accordion";
import { Button } from "@acme/ui/button";

import { useBackend } from "~/components/contexts/socket/SocketContextComponent";

function NewMatch() {
  const { SocketEmiter } = useBackend();
  const router = useRouter();
  const [selectedGameType, setSelectedGameType] = useState<{
    baseTime: number;
    incrementTime: number;
    name: string;
  }>({ baseTime: 10, incrementTime: 0, name: "Rapid" });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    setIsLoading(true);
    SocketEmiter(
      "find_match",
      { baseTime: selectedGameType.baseTime * 60000, incrementTime: selectedGameType.incrementTime * 1000 },
      (response: { data?: NOTIFICATION_PAYLOAD; error?: string }) => {
        if (response.data) {
          router.push(`/play/live/${response.data.id}`);
        } else router.push("/play/live");
        setIsLoading(false);
      },
    );
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
          <AccordionItem value="item-1">
            <AccordionTrigger className="rounded-md bg-white/10 px-4 py-3 text-lg hover:text-accent-foreground hover:no-underline">
              <span className="mx-auto">
                {selectedGameType.baseTime}
                {selectedGameType.incrementTime > 0 ? " | " + selectedGameType.incrementTime : " min"} ({selectedGameType.name})
              </span>
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance text-base">
              <div className="my-4 flex flex-col gap-4">
                {Object.entries(gameTypes).map(([gameTypeName, games]) => (
                  <div key={gameTypeName} className="">
                    {/* TODO: make it similar */}
                    <h2 className="w-full text-center text-sm capitalize">{gameTypeName}</h2>
                    <ButtonGroup className="flex w-full items-center justify-center gap-2">
                      {games.map((game, index) => (
                        <Button
                          key={index}
                          className={cn(
                            "h-auto flex-1 bg-white/10 p-3",
                            game.baseTime === selectedGameType.baseTime &&
                              game.incrementTime === selectedGameType.incrementTime &&
                              "border-2 border-primary",
                          )}
                          variant="outline"
                          onClick={() => {
                            setSelectedGameType({ ...game, name: gameTypeName.charAt(0).toUpperCase() + gameTypeName.slice(1) });
                          }}
                        >
                          {game.baseTime}
                          {game.incrementTime > 0 ? " | " + game.incrementTime : " min"}
                        </Button>
                      ))}
                    </ButtonGroup>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Button disabled={isLoading} color="success" onClick={handleSubmit} className="text-bold h-auto w-full py-3 text-xl text-white">
          Start Game
        </Button>
      </div>

      <div className="space-y-2">
        <Button variant="outline" className="h-auto w-full bg-white/10 py-1">
          <Image
            className="h-8 w-8"
            src="https://www.chess.com/bundles/web/images/color-icons/handshake.svg"
            alt="Play friend"
            width={32}
            height={32}
          />
          Play a Friend
        </Button>

        <Button variant="outline" className="h-auto w-full bg-white/10 py-1">
          <Image
            className="h-8 w-8"
            src="https://www.chess.com/bundles/web/images/color-icons/tournaments.svg"
            alt="Tournaments"
            width={32}
            height={32}
          />
          Tournaments
        </Button>
      </div>

      <div className="text-xl font-medium">
        Upcoming Tournaments
        {/* {display all upcoming tournaments} */}
      </div>

      <div className="mt-auto flex justify-center gap-10 pt-4 text-lg">
        <div className="font-medium">{2} Playing</div>
        <div className="font-medium">{1} Games</div>
      </div>
    </div>
  );
}

interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  vertical?: boolean;
}

const ButtonGroup: React.FC<ButtonGroupProps> = ({ vertical, className, children, ...props }) => {
  return (
    <div className={cn("flex", vertical ? "flex-col" : "flex-row", className)} {...props}>
      {children}
    </div>
  );
};

export default NewMatch;
