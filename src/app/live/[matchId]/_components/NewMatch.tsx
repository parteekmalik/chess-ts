import { Button, ButtonGroup, Card, CardBody, Tab, Tabs } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSocket } from "~/components/contexts/socket/SocketContextComponent";

function NewMatch() {
  const { data: session } = useSession();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    sendMessage("find_match", { ...selectedGameType, baseTime: selectedGameType.baseTime * 60000 });
  };
  const gameTypes = {
    bullet: [
      { baseTime: 1, incrementTime: 0 },
      { baseTime: 1, incrementTime: 1 },
      { baseTime: 2, incrementTime: 1 },
    ],
    blitz: [
      { baseTime: 3, incrementTime: 0 },
      { baseTime: 3, incrementTime: 2 },
      { baseTime: 5, incrementTime: 0 },
    ],
    rapid: [
      { baseTime: 10, incrementTime: 0 },
      { baseTime: 15, incrementTime: 10 },
      { baseTime: 30, incrementTime: 0 },
    ],
  };
  const router = useRouter();
  const { lastMessage, sendMessage } = useSocket();
  const [selectedGameType, setSelectedGameType] = useState<{
    baseTime: number;
    incrementTime: number;
  }>({ baseTime: 10, incrementTime: 0 });
  const [isGameOption, setIsGameOption] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (lastMessage?.type === "found_match") {
      const payload = lastMessage.payload as { matchId: string };
      router.push(`/live/${payload.matchId}`);
    }
  }, [lastMessage]);

  return (
    <div className="flex flex-col gap-4">
      <Button variant="bordered" onClick={() => setIsGameOption((prev) => !prev)} className="w-full">
        {selectedGameType.baseTime}
        {selectedGameType.incrementTime > 0 ? " | " + selectedGameType.incrementTime : " min"}
      </Button>

      {isGameOption && (
        <div className="my-4 flex flex-col gap-4">
          {Object.entries(gameTypes).map(([gameTypeName, games]) => (
            <div key={gameTypeName} className="">
              <h2 className="w-full text-center text-xl capitalize">
                {/* <img 
                              src={`/images/${gameTypeName}-icon.svg`} 
                              alt={`${gameTypeName} icon`} 
                              className="h-6 w-6" 
                            /> */}
                {gameTypeName}
              </h2>
              <ButtonGroup className="mx-auto flex flex-wrap items-center gap-2">
                {games.map((game, index) => (
                  <Button
                    key={index}
                    variant="bordered"
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

      <Button isLoading={isLoading} color="success" onClick={handleSubmit} className="w-full">
        Play
      </Button>

      <div className="space-y-4">
        <Button
          variant="bordered"
          startContent={<img className="h-8 w-8" src="https://www.chess.com/bundles/web/images/color-icons/handshake.svg" alt="Play friend" />}
          className="w-full"
        >
          Play a Friend
        </Button>

        <Button
          variant="bordered"
          startContent={<img className="h-8 w-8" src="https://www.chess.com/bundles/web/images/color-icons/tournaments.svg" alt="Tournaments" />}
          className="w-full"
        >
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

export default NewMatch;
