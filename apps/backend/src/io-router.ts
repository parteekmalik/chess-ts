import type { NOTIFICATION_PAYLOAD } from "@acme/lib/WStypes/typeForFrontendToSocket";
import express from "express";
import { env } from "./env";
import type { GameSocket } from "./services/GameSocket";


function getRouter(mySocket: GameSocket) {
  const ioRouter = express.Router();
  ioRouter.use((req, res, next) => {
    const secret = req.header("x-auth-secret");
    if (secret !== env.AUTH_SECRET) {
      res.status(401).send();
    } else next();
  });

  ioRouter.post("/emit_update", (req, res) => {
    const { matchId, match } = req.body as { matchId: string, match: NOTIFICATION_PAYLOAD };

    mySocket.emitUpdate(matchId, match);
    res.status(200).send();
  });
  ioRouter.post("/emit_match_created", (req, res) => {
    const { match } = req.body as { match: NOTIFICATION_PAYLOAD };

    mySocket.emitMatchCreated(match);
    res.status(200).send();
  });

  ioRouter.use((req, res) => {
    res.status(404).send("Not Found");
  });

  return ioRouter;
}

export { getRouter };
