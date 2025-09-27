"use client";

import { MatchesList } from "../cards/MatchesList";
import { ProfilesList } from "../cards/ProfilesList";
import { ListCollapser } from "./list-collapser";

export function SolanaChessDashboard() {
  return (
    <div className="space-y-8">
      <ListCollapser title="Active Matches">
        <MatchesList showActive colsLength={3} />
      </ListCollapser>
      <ListCollapser title="Waiting Matches">
        <MatchesList showWaiting colsLength={3} />
      </ListCollapser>
      <ListCollapser title="Finished Matches">
        <MatchesList showFinished colsLength={3} />
      </ListCollapser>
      <ListCollapser title="Profiles">
        <ProfilesList colsLength={3} />
      </ListCollapser>
    </div>
  );
}
