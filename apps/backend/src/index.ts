import http from "http";
import cors from "cors";
import express from "express";

import { env } from "./env";
import { GameSocket } from "./services/GameSocket";
import { apiRouter } from "./services/roter";

const app = express();
const server = http.createServer();

// Middleware for logging connections
app.use((req, res, next) => {
  console.log(`Connection received: ${req.method} ${req.url}`);
  next();
});

// Enable CORS
app.use(
  cors({
    origin: [env.AUTH_URL, "https://yourdomain.com", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

// Initialize socket server
new GameSocket(server);

app.use(express.static("public"));
app.use(apiRouter);

const PORT = env.PORT;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
