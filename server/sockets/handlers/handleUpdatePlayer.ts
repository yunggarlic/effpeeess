import * as THREE from "three";
import { Socket } from "socket.io";
import { gameState } from "../../game-state/game-state";
import { UpdatePlayerDataDto } from "@types";

export const handleUpdatePlayer = (
  socket: Socket,
  data: UpdatePlayerDataDto
) => {
  // Convert the received array data into THREE.Vector3 objects.
  // console.log("received update player", data);
  try {
    validateUpdatePlayerDto(data);
    const { velocity, position, rotation, timestamp } = data;
    const pos = new THREE.Vector3(...position);
    const vel = new THREE.Vector3(...velocity);
    const rot = new THREE.Quaternion(...rotation);
    const reportedState = {
      id: socket.id,
      position: pos,
      velocity: vel,
      rotation: rot,
      timestamp,
    };

    // Validate the reported state and update the authoritative game state.
    gameState.validateAndUpdatePlayer(reportedState);
    // Broadcast the update to all other clients.
    socket.broadcast.emit("updatePlayer", {
      id: socket.id,
      position: pos.toArray(),
      velocity: vel.toArray(),
      rotation: rot.toArray(),
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
