import { Socket } from "socket.io-client";
import * as THREE from "three";
import { OtherPlayers } from "@types";
import { Player } from "@libs/player";

export interface SocketEvents {
  updatePlayer: UpdatePlayerDataDto;
  removePlayer: RemovePlayerDataDto;
}

export interface SocketEmitEvents {
  updatePlayer: UpdatePlayerDataDto;
}

export interface SetupSocketListenersDto {
  socket: Socket;
  scene: THREE.Scene;
  otherPlayers: OtherPlayers;
  player: Player;
}

export interface UpdatePlayerDataDto extends Pick<Player, "id"> {
  x: number;
  y: number;
  z: number;
}
export interface RemovePlayerDataDto extends Pick<Player, "id"> {}
