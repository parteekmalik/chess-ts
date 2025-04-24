import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { gameTypes } from "@acme/lib";
import { NOTIFICATION_PAYLOAD } from "@acme/lib/WStypes/typeForFrontendToSocket";
import { cn } from "@acme/ui";
import { Button } from "@acme/ui/button";

import { useBackend } from "~/components/contexts/socket/SocketContextComponent";

function NewMatch() {
  const { SocketEmiter } = useBackend();
  const router = useRouter();
  const [selectedGameType, setSelectedGameType] = useState<{
    baseTime: number;
    incrementTime: number;
  }>({ baseTime: 10, incrementTime: 0 });
  const [isGameOption, setIsGameOption] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    setIsLoading(true);
    SocketEmiter(
      "find_match",
      { ...selectedGameType, baseTime: selectedGameType.baseTime * 60000 },
      (response: { data?: NOTIFICATION_PAYLOAD; error?: string }) => {
        if (response.data) {
          router.push(`/play/live/${response.data.id}`);
        }else router.push("/play/live");
        setIsLoading(false);
      },
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <Button variant="outline" onClick={() => setIsGameOption((prev) => !prev)} className="w-full">
        {selectedGameType.baseTime}
        {selectedGameType.incrementTime > 0 ? " | " + selectedGameType.incrementTime : " min"}
      </Button>

      {isGameOption && (
        <div className="my-4 flex flex-col gap-4">
          {Object.entries(gameTypes).map(([gameTypeName, games]) => (
            <div key={gameTypeName} className="">
              <h2 className="w-full text-center text-xl capitalize">{gameTypeName}</h2>
              <ButtonGroup className="flex items-center justify-center gap-1">
                {games.map((game, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    onClick={() => {
                      setSelectedGameType(game);
                      setIsGameOption(false);
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
      )}

      <Button disabled={isLoading} color="success" onClick={handleSubmit} className="w-full">
        Play
      </Button>

      <div className="space-y-4">
        <Button variant="outline" className="w-full">
          <Image
            className="h-8 w-8"
            src="https://www.chess.com/bundles/web/images/color-icons/handshake.svg"
            alt="Play friend"
            width={32}
            height={32}
          />
          Play a Friend
        </Button>

        <Button variant="outline" className="w-full">
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
