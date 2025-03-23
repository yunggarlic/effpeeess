import { Socket } from "socket.io";
import { gameState } from "../../game-state/game-state";
import { SocketListenerMessages } from "@shared";
const handleDisconnect = (socket: Socket) => {
    console.log(`Client disconnected: ${socket.id}`);
    gameState.removePlayer(socket.id);
    socket.broadcast.emit(SocketListenerMessages.RemovePlayer, { id: socket.id });
}

export default handleDisconnect