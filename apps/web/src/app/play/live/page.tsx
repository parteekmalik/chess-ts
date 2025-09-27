"use client";

import { BoardWithTime } from "~/components/LiveMatch/BoardWithTime";
import { useFindMatch } from "~/components/LiveMatch/hooks/useFindMatch";

function Online() {
  const { findMatchViaSocket, isLoading: isInMatching } = useFindMatch();

  const createMatch = (baseTime: number, incrementTime: number) => {
    findMatchViaSocket(baseTime, incrementTime);
  };
  return (
    <div className="flex h-full justify-center p-2">
      <BoardWithTime isInMatching={isInMatching} sideBar={{ createMatch }} />
    </div>
  );
}

export default Online;
