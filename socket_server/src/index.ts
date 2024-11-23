import express from 'express';
import http from 'http';
import cors from 'cors';
import { GameSocket } from './services/GameSocket';
import router from './services/roter';

const app = express();
const server = http.createServer(app);

// Middleware for logging connections
app.use((req, res, next) => {
  console.log(`Connection received: ${req.method} ${req.url}`);
  next();
});

// Enable CORS
app.use(
  cors({
    origin: [process.env.CORS_ORIGIN!, 'https://yourdomain.com', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }),
);

// Initialize socket server
new GameSocket(server);

app.use(express.static('public'));
app.use(router);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
