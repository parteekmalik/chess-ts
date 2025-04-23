import http from "http";
import cors from "cors";
import express from "express";
import { env } from "./env";
import { GameSocket } from "./services/GameSocket";
import { apiRouter } from "./services/roter";
import cookieParser from "cookie-parser";

const app = express();
app.use(cors());
app.use(cookieParser());

app.use((req, res, next) => {
  console.log(req.url);
  next();
});

app.use(apiRouter);

// eslint-disable-next-line @typescript-eslint/no-misused-promises
const server = http.createServer(app);

new GameSocket(server);

const PORT = env.PORT || 3000;
server.listen(PORT, env.NODE_ENV === "production" ?'0.0.0.0':"127.0.0.1", () => {
  console.log(`Server listening on port ${PORT}`);
});
