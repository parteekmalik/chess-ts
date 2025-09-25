import { useChessMatch, useIsPlayerInMatch, useMakeMoveMutation } from '@acme/chess-queries';
import { calculateTimeLeft, ChessMoveType } from '@acme/lib';
// import { useWalletUi } from '@wallet-ui/react';
import { Chess } from 'chess.js';
import { address } from 'gill';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';
import { BoardWithTime } from '~/components/LiveMatch/BoardWithTime';

export function Web3MatchPage() {
  const params = useParams();
  const matchAddress = address(params.matchAddress as string);
  // const { account } = useWalletUi();
  const { data: match } = useChessMatch(matchAddress);
  const gameState = useMemo(() => { const game = new Chess(); match?.moves.forEach(mv => game.move(mv.san)); return game }, [match])
  const iAmPlayer = useIsPlayerInMatch(matchAddress);
  const makeMoveMutation = useMakeMoveMutation();
  const playerTimes = useMemo(() => {
    const timeData = match
      ? calculateTimeLeft(
        { baseTime: match.baseTimeSeconds, incrementTime: match.incrementSeconds },
        [match.createdAt].concat(match.moves.map((move) => move.ts)),
      )
      : { w: 0, b: 0 };
    return timeData;
  }, [match?.moves]);

  const handleMove = (move: ChessMoveType) => {
    if (!match) return;
    if (typeof move === 'object') {
      console.error("only san is acceped")
    }
    else makeMoveMutation.mutate({
      matchId: match.matchId,
      move,
    });
  };
  if (!match) return <div>Match not found</div>
  return (
    <div>
      <BoardWithTime
        gameState={gameState}
        initalFlip={iAmPlayer ?? "w"}
        turn={match.moves.length % 2 === 0 ? "w" : "b"}
        // result={match.stats}
        whitePlayerData={{ time: playerTimes.w, }}
        blackPlayerData={{ time: playerTimes.b, }}
        handleMove={handleMove}
      />
    </div>
  )
}

