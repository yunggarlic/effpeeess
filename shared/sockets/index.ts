import * as THREE from "three";
import { Player } from "server/game-objects/player";
import { LocalPlayer } from "@libs/player";
import { OtherPlayers } from "@types";

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
  position: number[]; // representing x,y,z
  velocity: number[]; // representing x,y,z
  rotation: number[]; // representing x,y,z,w
  timestamp: number;
}
export interface RemovePlayerDataDto extends Pick<Player, "id"> {}
export interface CreatePlayerDataDto extends Pick<Player, "id"> {}
export interface InitializePlayerDataDto {
  players: Player[];
  newPlayer: Player;
}
export interface BulletCreateDataDto {
  id: string;
  position: number[];
  velocity: number[];
  rotation: number[];
  timestamp: number;
}
export interface BulletHitDataDto {
  id: string;
  position: number[];
  velocity: number[];
  rotation: number[];
  timestamp: number;
}
