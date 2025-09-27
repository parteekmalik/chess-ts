import React, { useState } from "react";
import Image from "next/image";

import { gameTypes } from "@acme/lib";
import { cn } from "@acme/ui";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@acme/ui/accordion";
import { Button } from "@acme/ui/button";

import { useBoard } from "../contexts/Board/BoardContextComponent";

export function NewMatch() {
  const [selectedGameType, setSelectedGameType] = useState<{
    baseTime: number;
    incrementTime: number;
    name: string;
  }>({ baseTime: 10, incrementTime: 0, name: "Rapid" });

  const { sideBar, isInMatching } = useBoard();

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="rounded-md bg-white/10 px-4 py-3 text-lg hover:text-accent-foreground hover:no-underline">
              <span className="mx-auto">
                {selectedGameType.baseTime}
                {selectedGameType.incrementTime > 0 ? " | " + selectedGameType.incrementTime : " min"} ({selectedGameType.name})
              </span>
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance text-base">
              <div className="my-4 flex flex-col gap-3">
                {Object.entries(gameTypes).map(([gameTypeName, games]) => (
                  <div key={gameTypeName} className="">
                    <h2 className="mb-1 flex items-center gap-1 text-sm capitalize">
                      <span className="cc-icon-glyph cc-icon-size-16 time-selector-section-icon glyph-colored">
                        {icons[gameTypeName as keyof typeof gameTypes]}
                      </span>
                      <span>{gameTypeName}</span>
                    </h2>
                    <ButtonGroup className="flex w-full items-center justify-center gap-2">
                      {games.map((game, index) => (
                        <Button
                          key={index}
                          className={cn(
                            "h-auto flex-1 bg-white/10 p-3 hover:bg-white/5",
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
        <Button
          disabled={isInMatching}
          color="success"
          onClick={() => sideBar?.createMatch?.(selectedGameType.baseTime * 60000, selectedGameType.incrementTime * 1000)}
          className="text-bold h-auto w-full py-3 text-xl text-white"
        >
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

const icons: Record<keyof typeof gameTypes, React.JSX.Element> = {
  bullet: (
    <svg
      className="fill-[#e3aa24]"
      aria-hidden="true"
      data-glyph="game-time-bullet"
      viewBox="0 0 24 24"
      height="16"
      width="16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        xmlns="http://www.w3.org/2000/svg"
        d="M7.17005 15.2999L8.60005 16.7699L0.330049 23.6699L7.17005 15.2999ZM0.300049 17.5999L4.80005 11.5999L5.70005 13.5999L0.300049 17.5999ZM10.77 10.0999C14.24 6.49994 16.7 4.89994 19.47 3.69994C17.07 3.69994 14.17 4.06994 9.67005 8.29994C9.70005 8.79994 10.37 9.76994 10.77 10.0999ZM21.83 2.16994C21.83 2.16994 22.06 3.26994 22.06 4.93994C22.06 7.60994 21.39 11.7699 17.89 15.2699L15.72 17.4399C15.05 18.1099 14.39 18.0399 13.59 17.7099L6.12005 24.0099L15.92 11.8399L10.69 15.8699C10.26 15.4699 9.76005 15.0399 9.36005 14.6399C7.63005 12.9399 5.23005 9.63994 6.59005 8.26994L8.79005 6.13994C12.32 2.63994 16.42 1.93994 19.09 1.93994C20.72 1.93994 21.82 2.16994 21.82 2.16994H21.83Z"
      ></path>
    </svg>
  ),
  blitz: (
    <svg
      className="fill-[#fad541]"
      aria-hidden="true"
      data-glyph="game-time-blitz"
      viewBox="0 0 24 24"
      height="16"
      width="16"
      xmlns="http://www.w3.org/2000/svg"
    >
      {" "}
      <path
        xmlns="http://www.w3.org/2000/svg"
        d="M5.77002 15C4.74002 15 4.40002 14.6 4.57002 13.6L6.10002 3.4C6.27002 2.4 6.73002 2 7.77002 2H13.57C14.6 2 14.9 2.4 14.64 3.37L11.41 15H5.77002ZM18.83 9C19.86 9 20.03 9.33 19.4 10.13L9.73002 22.86C8.50002 24.49 8.13002 24.33 8.46002 22.29L10.66 8.99L18.83 9Z"
      ></path>
    </svg>
  ),
  rapid: (
    <svg
      className="fill-[#81b64c]"
      aria-hidden="true"
      data-glyph="game-time-rapid"
      viewBox="0 0 24 24"
      height="16"
      width="16"
      xmlns="http://www.w3.org/2000/svg"
    >
      {" "}
      <path
        xmlns="http://www.w3.org/2000/svg"
        d="M11.97 14.63C11.07 14.63 10.1 13.9 10.47 12.4L11.5 8H12.5L13.53 12.37C13.9 13.9 12.9 14.64 11.96 14.64L11.97 14.63ZM12 22.5C6.77 22.5 2.5 18.23 2.5 13C2.5 7.77 6.77 3.5 12 3.5C17.23 3.5 21.5 7.77 21.5 13C21.5 18.23 17.23 22.5 12 22.5ZM12 19.5C16 19.5 18.5 17 18.5 13C18.5 9 16 6.5 12 6.5C8 6.5 5.5 9 5.5 13C5.5 17 8 19.5 12 19.5ZM10.5 5.23V1H13.5V5.23H10.5ZM15.5 2H8.5C8.5 0.3 8.93 0 12 0C15.07 0 15.5 0.3 15.5 2Z"
      ></path>
    </svg>
  ),
  daily: (
    <svg
      className="fill-[#f7c631]"
      aria-hidden="true"
      data-glyph="game-time-daily"
      viewBox="0 0 24 24"
      height="16"
      width="16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        xmlns="http://www.w3.org/2000/svg"
        d="M0.93 11.63C4.23 10.3 4.7 8.8 2.7 5.86L1.77 4.53L3.4 5.03C6.8 6.03 8 5.13 8.03 1.6L8.06 0L9.06 1.27C11.23 4.07 12.76 4.07 14.93 1.27L15.93 0L15.96 1.6C15.99 5.13 17.19 6.03 20.59 5.03L22.22 4.53L21.29 5.86C19.29 8.79 19.76 10.29 23.06 11.63L23.99 12L23.06 12.37C19.76 13.7 19.29 15.2 21.29 18.14L22.22 19.47L20.59 18.97C17.19 17.97 15.99 18.87 15.96 22.4L15.93 24L14.93 22.73C12.76 19.93 11.23 19.93 9.06 22.73L8.06 24L8.03 22.4C8 18.87 6.8 17.97 3.4 18.97L1.77 19.47L2.7 18.14C4.7 15.21 4.23 13.71 0.93 12.37L0 12L0.93 11.63ZM6 12C6 15.19 8.86 18 12 18C15.18 18 18 15.18 18 12C18 8.86 15.19 6 12 6C8.85 6 6 8.85 6 12ZM8 12C8 9.68 9.68 8 12 8C14.35 8 16 9.68 16 12C16 14.35 14.35 16 12 16C9.68 16 8 14.35 8 12Z"
      ></path>
    </svg>
  ),
};
