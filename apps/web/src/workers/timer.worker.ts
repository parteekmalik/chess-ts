interface TimerMessage {
  time: number;
}

// Listen for messages from the main thread
self.onmessage = (event: MessageEvent<TimerMessage>) => {
  setInterval(() => {
    event.data.time -= 100;
    self.postMessage(event.data.time);
  }, 100); 
};
