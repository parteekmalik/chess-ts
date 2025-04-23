import { Chess } from "chess.js";
import { Server as SocketServer } from "socket.io";

import { MatchRoom } from "../src/services/gemeRoom";

describe("MatchRoom", () => {
  let matchRoom: MatchRoom;

  beforeEach(() => {
    const io = new SocketServer();
    matchRoom = new MatchRoom("whitePlayer", "blackPlayer", new Chess(), io, "matchId", new Date(), { baseTime: 300000, incrementTime: 5000 });
  });

  describe("calculateTimeLeft", () => {
    it("should calculate time left correctly for white player", () => {
      const timeLeft = matchRoom.calculateTimeLeft("w", [], true); // on testing mode 7 moves will be made every 10 seconds
      expect(timeLeft).toBe(285000); // 300000 - (10000 * 3) + (5000 * 3)
    });

    it("should calculate time left correctly for black player", () => {
      const timeLeft = matchRoom.calculateTimeLeft("b", [], true); // on testing mode 6 moves will be made every 10 seconds
      expect(timeLeft).toBe(290000); // 300000 - (10000 * 2) + (5000 * 2)
    });
  });
});
