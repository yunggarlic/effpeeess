import { Socket } from "socket.io";
import { gameState } from "../../game-state/authoritativeGameState";
const handleDisconnect = (socket: Socket) => {
    console.log(`Client disconnected: ${socket.id}`);
    gameState.removePlayer(socket.id);
    socket.broadcast.emit("removePlayer", { id: socket.id });
}

export default handleDisconnect