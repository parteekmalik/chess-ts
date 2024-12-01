"use client";
import { Button } from "@nextui-org/react";
import { type Color } from "chess.js";
import moment from "moment";
import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { useSocket } from "~/components/contexts/socket/SocketContextComponent";
import type { ChessMoveType } from "~/modules/board/boardMain";
import BoardWithTime from "./_components/BoardWithTime";
import Result from "./_components/result";

const LiveBoard: React.FunctionComponent = () => {
  const { lastMessage, sendMessage, guestId } = useSocket();
  const params = useParams();
  const [gameDetails, setGameDetails] = useState<{ baseTime: number; incrementTime: number } | null>(null);
  const [movesPlayed, setMovesPlayed] = useState<ChessMoveType[]>([]);
  const [playerTurn, setPlayerTurn] = useState<Color | null>(null);
  const [whitePlayerTime, setWhitePlayerTime] = useState<string | null>(null);
  const [blackPlayerTime, setBlackPlayerTime] = useState<string | null>(null);
  const [openResult, setOpenResult] = useState<{ isOpen: boolean; status: { isover: boolean; winner: Color | "draw"; reason: string } | null }>({
    isOpen: false,
    status: null,
  });

  useEffect(() => {
    console.log("params -> ", params);
    sendMessage("join_match", params.matchId);
  }, [params, sendMessage]);

  useEffect(() => {
    if (lastMessage?.type === "joined_match") {
      sendMessage("start_match", "joined match room", params.matchId as string);
    } else if (lastMessage?.type === "match_update") {
      if ((lastMessage.payload as { matchId: string }).matchId === params.matchId) {
        const payload = lastMessage.payload as { matchId: string; moves: ChessMoveType[]; players: { w: { timeLeft: string }; b: { timeLeft: string } } };
        console.log("match update -> ", lastMessage.payload);
        setMovesPlayed(payload.moves);
        setWhitePlayerTime(payload.players.w.timeLeft);
        setBlackPlayerTime(payload.players.b.timeLeft);
      }
    } else if (lastMessage?.type === "set_match_details") {
      console.log("set match details -> ", lastMessage.payload);
      const payload = lastMessage.payload as { matchId: string; moves: ChessMoveType[]; players: { w: { id: string; timeLeft: string }; b: { id: string; timeLeft: string } }; config: { baseTime: number; incrementTime: number } };

      setGameDetails(payload.config);
      setMovesPlayed(payload.moves);
      setWhitePlayerTime(payload.players.w.timeLeft);
      setBlackPlayerTime(payload.players.b.timeLeft);
      if (payload.players.w.id === guestId) {
        setPlayerTurn("w");
      } else if (payload.players.b.id === guestId) {
        setPlayerTurn("b");
      } else {
        setPlayerTurn(null); // spectator
      }
    } else if (lastMessage?.type === "match_ended") {
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
      sendMessage("make_move_match", { move, matchId: params.matchId });
    },
    [params.matchId, sendMessage],
  );

  return (
    <div className="flex w-full flex-col text-background-foreground">
      <BoardWithTime
        isWhiteTurn={movesPlayed.length % 2 === 0}
        whitePlayerTime={parseInt(whitePlayerTime ?? "0")}
        blackPlayerTime={parseInt(blackPlayerTime ?? "0")}
        handleMove={handleMove}
        movesPlayed={movesPlayed}
        playerTurn={playerTurn}
      />
      <Result playerTurn={playerTurn} gameDetails={gameDetails} isOpen={openResult.isOpen} status={openResult.status} />
      <pre>{JSON.stringify([playerTurn, openResult.status], null, 2)}</pre>

      <div className="flex flex-col">
        <h2>Socket IO Information:</h2>
        <div>{JSON.stringify(params)}</div>
        {Object.entries({ lastMessage, guestId }).map(([key, value]) => {
          return key !== "socket" && key !== "game" ? (
            <div key={key}>
              {key}:{" "}
              {typeof value === "object" ? (
                <details>
                  <summary>Show/Hide Object</summary>
                  <pre>{JSON.stringify(value, null, 2)}</pre>
                </details>
              ) : (
                JSON.stringify(value)
              )}
            </div>
          ) : null;
        })}
        <Button
          onPress={() => {
            sessionStorage.clear();
            window.location.reload();
          }}
        >
          Clear Session & Reload
        </Button>
        <div className="flex flex-col gap-2">
          <span>Player Turn: {playerTurn}</span>
          <span>White Time: {whitePlayerTime}</span>
          <span>Black Time: {blackPlayerTime}</span>
        </div>

        {/* <div className="flex flex-wrap gap-5">
          {SocketState.game.turn() === SocketState.board_data.solveFor &&
            SocketState.game.moves().map((m) => (
              <div
                className="bg-slate-500 p-2 text-white"
                onClick={() => {
                  SocketDispatch({ type: "move_piece", payload: m });
                }}
                key={m}
              >
                {m}
              </div>
            ))}
        </div> */}
      </div>
    </div>
  );
};

export default LiveBoard;
