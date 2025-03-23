import { Socket } from "socket.io";
import { gameState } from "../../game-state/game-state";
import { handleUpdatePlayer } from "./handleUpdatePlayer";
import handleDisconnect from "./handleDisconnect";
import { SocketListenerMessages } from "@shared";
import { handleCreateBullet } from "./handleCreateBullet";
import { Player } from "server/game-objects/player";
import { SocketEvents } from "shared/sockets/SocketEventMap";
import { handleInitializePlayer } from "./handleInitializePlayer";
import { BulletCreateDataDto } from "shared/sockets";

export const handleConnection = (
  socket: Socket<SocketEvents["on"], SocketEvents["emit"]>
) => {
  console.log(`Client connected: ${socket.id}`);
  const newPlayer = new Player({ multiplayerId: socket.id });
  gameState.addPlayer(newPlayer);

  socket.on(SocketListenerMessages.Initialize, () =>
    handleInitializePlayer(socket, newPlayer)
  );
  socket.on(SocketListenerMessages.UpdatePlayer, (data) =>
    handleUpdatePlayer(socket, data)
  );
  socket.on(SocketListenerMessages.BulletCreate, (data: BulletCreateDataDto) =>
    handleCreateBullet(socket, data)
  );
  socket.on(SocketListenerMessages.Disconnect, () => {
    handleDisconnect(socket);
  });

  // Notify other clients about the new player.
  socket.broadcast.emit(SocketListenerMessages.CreatePlayer, newPlayer);
};
