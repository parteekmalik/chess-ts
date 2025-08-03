import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import http from "http";
import { env } from "./env";
import { apiRouter } from "./router";
import { getRouter } from "./io-router";
import { GameSocket } from "./services/GameSocket";

const app = express();

// 🔧 Middleware
app.use(cors());

// 🔌 Create HTTP server and socket
// eslint-disable-next-line @typescript-eslint/no-misused-promises
const server = http.createServer(app);
const mySocket = new GameSocket(server);

app.use(express.json());
app.use(cookieParser());

// 🔍 Simple request response logger logger
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`, "Data: ", req.body);
  const oldSend = res.send;

  res.send = function (data) {
    console.log(`[${req.method}] ${req.url}`, 'Response:', data);
    return oldSend.call(this, data);
  };
  next();
});

// 📦 Mount API routes
app.use(apiRouter);
app.use(getRouter(mySocket));
app.use((req, res) => {
  res.status(404).send("Not Found");
});

// 🚀 Start server
const PORT = env.PORT || 3000;
server.listen(
  PORT,
  env.NODE_ENV === "production" ? "0.0.0.0" : "127.0.0.1",
  () => {
    console.log(`✅ Server listening on port ${PORT}`);
  }
);
