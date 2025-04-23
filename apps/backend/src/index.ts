import http from "http";
import cors from "cors";
import express from "express";
import { env } from "./env";
import { GameSocket } from "./services/GameSocket";
import { apiRouter } from "./services/roter";
import cookieParser from "cookie-parser";

const app = express();
app.use(cors());

const server = http.createServer();
app.use(cookieParser());

// Initialize socket server
app.use((req, res, next) => {
  console.log(req.url);
  next();
});
app.use(apiRouter);

new GameSocket(server);

const PORT = env.PORT;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
