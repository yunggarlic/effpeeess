import * as THREE from "three";
import { Socket } from "socket.io";
import { gameState } from "../../game-state/authoritativeGameState";

export const handleUpdatePlayer = (
  socket: Socket,
  data: { position: number[]; velocity: number[]; timestamp: number }
) => {
  // Convert the received array data into THREE.Vector3 objects.
  // console.log("received update player", data);
  try {
    validateUpdatePlayerDto(data);
    const { velocity, position } = data;
    const pos = new THREE.Vector3(...position);
    const vel = new THREE.Vector3(...velocity);
    const reportedState = {
      id: socket.id,
      position: pos,
      velocity: vel,
      timestamp: data.timestamp,
    };

    // Validate the reported state and update the authoritative game state.
    gameState.validateAndUpdatePlayer(reportedState);
    console.log("broadcasting update player");
    // Broadcast the update to all other clients.
    socket.broadcast.emit("updatePlayer", {
      id: socket.id,
      position: pos.toArray(),
      velocity: vel.toArray(),
      timestamp: data.timestamp,
    });
  } catch (error) {
    console.error("Error updating player", error);
  }
};

const validateUpdatePlayerDto = (data: any) => {
  if (!Array.isArray(data.position) || data.position.length !== 3) {
    throw new Error("Invalid position data");
  }
  if (!Array.isArray(data.velocity) || data.velocity.length !== 3) {
    throw new Error("Invalid velocity data");
  }
  if (typeof data.timestamp !== "number") {
    throw new Error("Invalid timestamp data");
  }
};
