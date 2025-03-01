import { Socket } from "socket.io-client";
import { SocketEmitEvents } from "@types";

export function emit<E extends keyof SocketEmitEvents>(
  socket: Socket,
  eventName: E,
  data: SocketEmitEvents[E]
) {
  socket.emit(eventName, data);
}
