// server.ts
import express from "express";
import { initializeSockets } from "./sockets/socket";
import { gameState } from "./game-state/game-state";
import http from "http";
import path from "path";
import { SocketListenerMessages } from "@shared";

// Create Express app and HTTP server
const app = express();

// Serve static files (like your client build) if needed.
const server = http.createServer(app);
const { io } = initializeSockets(server);

app.get("/", (req, res) => {
  const filePath = path.join(__dirname, "..", "dist", "index.html");
  console.log("Serving file from:", filePath);
  res.sendFile(filePath, (err: any) => {
    if (err) {
      console.error("Error sending file:", err);
      res.status(err.status || 500).end();
    }
  });
});

app.use(express.static(path.join(__dirname, "..", "dist")));

// Set up a fixed tick loop for the server simulation.
const TICK_RATE = 60; // ticks per second
const TICK_INTERVAL = 1000 / TICK_RATE; // in milliseconds

setInterval(() => {
  // Update the authoritative game state.
  const deltaTime = TICK_INTERVAL / 1000; // convert ms to seconds
  gameState.update(deltaTime);

  const stateUpdatePayload = gameState.getStateUpdatePayload();

  // Broadcast the latest state to all clients.
  io.emit(SocketListenerMessages.StateUpdate);
}, TICK_INTERVAL);

// Start the server.
const PORT = process.env.PORT || 5173;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
