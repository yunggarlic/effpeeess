import { Socket } from "socket.io";
import * as THREE from "three";
import {
  gameState,
  PlayerState,
} from "../../game-state/authoritativeGameState";
import { handleUpdatePlayer } from "./updatePlayer";
import handleDisconnect from "./disconnect";
import { SocketListenerMessages } from "@shared";

export const handleConnection = (socket: Socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Create a new player with an initial state.
  const position = new THREE.Vector3(0, 0, 0);
  const velocity = new THREE.Vector3(0, 0, 0);
  const rotation = new THREE.Quaternion(0, 0, 0, 1);
  const newPlayer: PlayerState = {
    id: socket.id,
    position,
    velocity,
    rotation,
    materialId: 0,
    geometryId: 0,
    lastUpdateTime: Date.now(),
  };
  gameState.addPlayer(newPlayer);

  socket.on(SocketListenerMessages.Initialize, () => {
    socket.emit(SocketListenerMessages.Initialize, {
      players: gameState.players,
      multiplayerId: socket.id,
    });
  });

  // Notify other clients about the new player.
  socket.broadcast.emit(SocketListenerMessages.CreatePlayer, newPlayer);

  // Listen for movement updates from the client.
  socket.on(SocketListenerMessages.UpdatePlayer, (data) =>
    handleUpdatePlayer(socket, data)
  );

  // Listen for shooting events.
  socket.on("shoot", (data) => {
    // Optionally add server-side validation for shooting rate or bullet simulation.
    // Broadcast the shoot event to all other clients.
    socket.broadcast.emit("shoot", { shooterId: socket.id, ...data });
  });

  // Handle disconnects.
  socket.on("disconnect", () => {
    handleDisconnect(socket);
  });
};
