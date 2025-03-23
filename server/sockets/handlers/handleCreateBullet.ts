import { Socket } from "socket.io";
import { BulletCreateDataDto } from "@types";
import { SocketListenerMessages } from "@shared";

export const handleCreateBullet = (
  socket: Socket,
  data: BulletCreateDataDto
) => {
  // console.log("received create bullet", data);
  try {
    // validateBulletCreateDto(data);
    const { position, rotation, velocity, timestamp } = data;
    const payload = {
      id: socket.id,
      position,
      rotation,
      velocity,
      timestamp,
    };
    // Broadcast the bullet creation to all other clients.
    socket.broadcast.emit(SocketListenerMessages.BulletCreate, payload);
  } catch (error) {
    console.error("Error creating bullet", error);
  }
};
