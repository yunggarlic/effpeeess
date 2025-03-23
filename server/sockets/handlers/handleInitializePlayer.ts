import { Socket } from "socket.io";
import { gameState } from "../../game-state/game-state";
import { SocketListenerMessages } from "@shared";
import { Player } from "server/game-objects/player";

export const handleInitializePlayer = (socket: Socket, newPlayer: Player) => {
  socket.emit(SocketListenerMessages.InitializePlayer, {
    players: gameState.getAllPlayers(), // all player data including local player
    newPlayer,
  });
};
