import type { Color } from "chess.js";
import React from "react";

import { Button } from "@acme/ui/button";

interface BoardSettingsProps {
  setFlip: React.Dispatch<React.SetStateAction<Color>>;
  doMove: () => void;
  undoMove: () => void;
}

export function BoardSettings(props: BoardSettingsProps) {
  const { doMove, undoMove, setFlip } = props;
  return (
    <div className="flex w-full gap-1 p-2 px-0">
      <Button className="flex-1 text-xl text-white" onClick={undoMove}>
        Back
      </Button>
      <Button className="flex-1 text-xl text-white" onClick={doMove}>
        Next
      </Button>
      <Button
        className="text-xl text-white"
        onClick={() => {
          setFlip((flip) => (flip === "w" ? "b" : "w"));
        }}
      >
        Flip
      </Button>
    </div>
  );
}
