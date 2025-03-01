import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files from the 'public' folder
app.use(express.static('public'));

io.on("connection", (socket) => {
  console.log("A user connected: " + socket.id);

  // Receive player updates and broadcast to others
  socket.on("updatePlayer", (data: { x: number; y: number; z: number }) => {
    socket.broadcast.emit("updatePlayer", { id: socket.id, ...data });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected: " + socket.id);
    socket.broadcast.emit("removePlayer", { id: socket.id });
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
