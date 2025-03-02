import * as THREE from "three";
import { Player } from "../libs/player";
import { GameObject } from "./game-object";

export interface OtherPlayers {
  [id: string]: Player;
}

// --- Bullet (Shooting) Implementation ---
export interface Bullet extends GameObject {
  mesh: THREE.Mesh;
  velocity: THREE.Vector3;
  distanceTraveled: number;
}

export interface GameConfiguration {
  bulletSpeed: number;
  bulletMaxDistance: number;
  moveSpeed: number;
}
export enum GameObjectTypes {
  Player = "Player",
  Bullet = "Bullet",
  Collidable = "Collidable",
}