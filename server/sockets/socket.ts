import { Server as SocketIOServer } from "socket.io";
import { Server } from "http";
import { handleConnection } from "./handlers/handleConnection";

interface SocketsInitialized {
    io: SocketIOServer;
}

export const initializeSockets = (server: Server): SocketsInitialized => {
    const io = new SocketIOServer(server);

    // When a client connects:
    io.on("connection", handleConnection);

    return { io };
}
