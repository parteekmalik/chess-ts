import React from "react";

import type { ChatMessageType } from "./BoardWithTime";

function MovesDisplay({ chatMessages }: { chatMessages: ChatMessageType[] }) {
  return <div>{JSON.stringify(chatMessages)}</div>;
}

export default MovesDisplay;
