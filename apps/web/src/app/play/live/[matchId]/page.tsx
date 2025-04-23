"use client";

import type { Color } from "chess.js";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { Chess } from "chess.js";
import moment from "moment";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

import type { ChessMoveType } from "~/modules/board/boardMain";
import { useBackend } from "~/components/contexts/socket/SocketContextComponent";
import { env } from "~/env";
import BoardWithTime from "./_components/BoardWithTime";
import Result from "./_components/result";

interface matchDetails {
  matchId: string;
  moves: ChessMoveType[];
  players: { w: { id: string; timeLeft: number }; b: { id: string; timeLeft: number } };
  config: { baseTime: number; incrementTime: number };
}

const LiveBoard: React.FunctionComponent = () => {
  const { data: session } = useSession();
  const params = useParams();
  const { SocketEmiter, lastMessage } = useBackend();
  const [gameDetails, setGameDetails] = useState<{ baseTime: number; incrementTime: number } | null>(null);
  const [movesPlayed, setMovesPlayed] = useState<ChessMoveType[]>([]);
  const [whitePlayerTime, setWhitePlayerTime] = useState<number>(0);
  const [blackPlayerTime, setBlackPlayerTime] = useState<number>(0);
  const [openResult, setOpenResult] = useState<{ isOpen: boolean; status: { isover: boolean; winner: Color | "draw"; reason: string } | null }>({
    isOpen: false,
    status: null,
  });
  const [iAmPlayer, setIAmPlayer] = useState<Color | null>(null);
  const isFetching = useRef(false);

  useEffect(() => {
    if (isFetching.current) return;

    const res = SocketEmiter("join_match", params.matchId, (responce: { data?: matchDetails; error?: string }) => {
      if (responce.data) {
        const payload = responce.data;
        setGameDetails(payload.config);
        setMovesPlayed(payload.moves);
        setWhitePlayerTime(payload.players.w.timeLeft);
        setBlackPlayerTime(payload.players.b.timeLeft);
        setIAmPlayer(payload.players.w.id === session?.user.id ? "w" : payload.players.b.id === session?.user.id ? "b" : null);
      } else {
        console.error("Error joining match: ", responce.error);
      }
      isFetching.current = false;
    });
    if (res) isFetching.current = true;
  }, [params.matchId, SocketEmiter]);

  useEffect(() => {
    if (lastMessage.type === "joined_match") {
      const payload = lastMessage.payload as { id: string; count: number };
      toast.success(`user ${payload.id} joined match. Total count is ${payload.count} now`);
    } else if (lastMessage.type === "match_update") {
      if ((lastMessage.payload as { matchId: string }).matchId === params.matchId) {
        const payload = lastMessage.payload as Omit<matchDetails, "config">;

        console.log("match update -> ", lastMessage.payload);
        setMovesPlayed(payload.moves);
        setWhitePlayerTime(payload.players.w.timeLeft);
        setBlackPlayerTime(payload.players.b.timeLeft);
      }
    } else if (lastMessage.type === "match_ended") {
      if ((lastMessage.payload as { matchId: string }).matchId === params.matchId) {
        setOpenResult((prev) => ({
          isOpen: !prev.isOpen,
          status: (lastMessage.payload as { stats: { isover: boolean; winner: Color | "draw"; reason: string } }).stats,
        }));
      }
    }
  }, [lastMessage]);

  const handleMove = useCallback(
    (move: ChessMoveType) => {
      console.log("move in live board -> ", move, moment().format("HH:mm:ss"));
      SocketEmiter("make_move_match", { move, matchId: params.matchId });
    },
    [params.matchId, SocketEmiter],
  );

  const gameState = useMemo(() => {
    const game = new Chess();
    movesPlayed.forEach((move) => {
      game.move(move);
    });
    return game;
  }, [movesPlayed]);

  return (
    <div className="text-background-foreground flex w-full flex-col">
      <BoardWithTime
        disabled
        gameState={gameState}
        initalFlip={iAmPlayer ?? "w"}
        isWhiteTurn={movesPlayed.length % 2 === 0}
        whitePlayerTime={whitePlayerTime}
        blackPlayerTime={blackPlayerTime}
        handleMove={handleMove}
      />
      {openResult.isOpen && <Result playerTurn={iAmPlayer} gameDetails={gameDetails} status={openResult.status} />}

      {env.NODE_ENV === "development" && (
        <details className="flex w-[50%] flex-col">
          <summary className="hover:cursor-pointer">Socket IO Information:</summary>
          <pre>
            <div className="flex flex-col">
              <pre>{JSON.stringify([iAmPlayer, openResult.status])}</pre>
              <div>{JSON.stringify(params)}</div>
              <div className="flex flex-col gap-2">
                <span>Player Turn: {iAmPlayer}</span>
                <span>White Time: {whitePlayerTime}</span>
                <span>Black Time: {blackPlayerTime}</span>
              </div>
            </div>
          </pre>
        </details>
      )}
    </div>
  );
};

export default LiveBoard;
