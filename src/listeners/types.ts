import * as THREE from "three";
import { OtherPlayers } from "@types";
import { LocalPlayer, Player } from "@libs/player";

export interface SocketEvents {
  updatePlayer: UpdatePlayerDataDto;
  removePlayer: RemovePlayerDataDto;
}

export interface SocketEmitEvents {
  updatePlayer: UpdatePlayerDataDto;
}

export interface SetupSocketListenersDto {
  scene: THREE.Scene;
  otherPlayers: OtherPlayers;
  localPlayer: LocalPlayer;
}

export interface UpdatePlayerDataDto extends Pick<Player, "id"> {
  x: number;
  y: number;
  z: number;
}
export interface RemovePlayerDataDto extends Pick<Player, "id"> {}
