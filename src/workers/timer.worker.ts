// Import necessary types
interface TimerMessage {
  isWhiteTurn: boolean;
  whiteTime: number;
  blackTime: number;
}

// Listen for messages from the main thread
self.onmessage = (event: MessageEvent<TimerMessage>) => {
  let { isWhiteTurn, whiteTime, blackTime } = event.data;

  // Timer logic (simplified)
  setInterval(() => {
    if (isWhiteTurn) {
      whiteTime -= 100; // Decrease white time
    } else {
      blackTime -= 100; // Decrease black time
    }

    // Post updated times back to the main thread
    self.postMessage({ whiteTime, blackTime });
  }, 100); // Update every 100ms
};
