import { Button, Image, Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from "@nextui-org/react";
import { Color } from "chess.js";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSocket } from "~/components/contexts/socket/SocketContextComponent";

function Result({
  playerTurn,
  gameDetails,
  isOpen: isOpened,
  status,
}: {
  playerTurn: Color | null;
  gameDetails: { baseTime: number; incrementTime: number } | null;
  isOpen: boolean;
  status: { isover: boolean; winner: Color | "draw"; reason: string } | null;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (isOpened) {
      onOpen();
    }
  }, [isOpened]);

  const [isLoading, setIsLoading] = useState(false);
  const { lastMessage, sendMessage } = useSocket();
  const router = useRouter();

  useEffect(() => {
    if (lastMessage?.type === "found_match") {
      const payload = lastMessage.payload as { matchId: string };
      router.push(`/play/live/${payload.matchId}`);
    }
  }, [lastMessage]);

  return (
    <>
      <Button onPress={onOpen}>Open Modal</Button>
      <Modal isOpen={isOpen} onClose={onClose} backdrop="transparent">
        <ModalContent className="w-fit text-background-foreground">
          <ModalHeader className="flex flex-row items-center justify-center gap-4 bg-background-600 pr-10">
            {status?.winner === playerTurn && (
              <Image className="aspect-square w-10" src="https://www.chess.com/bundles/web/images/color-icons/cup.svg" alt="trophy" />
            )}
            <div className="flex flex-col items-center justify-center">
              <h1 className="text-2xl font-bold">{status?.winner === playerTurn ? "You Won!" : status?.winner === "draw" ? "Draw!" : "You Lost!"}</h1>
              <p className="text-foreground-muted text-tiny">by {status?.reason}</p>
            </div>
          </ModalHeader>
          <ModalBody className="flex flex-col items-center justify-center bg-background">
            <div>Result</div>
            <Button
              isLoading={isLoading}
              onPress={() => {
                setIsLoading(true);
                sendMessage("find_match", gameDetails);
              }}
            >
              Play Again
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default Result;
