import * as THREE from "three";
import { GameObject } from "@core/game-object";

export const buildScene = (
  scene: THREE.Scene,
  gameObjects: (THREE.Mesh | THREE.Object3D)[]
) => {
  gameObjects.forEach((gameObject) => {
    scene.add(gameObject);
  });
};

export const addPlayersToScene = (
  scene: THREE.Scene,
  players: GameObject[]
) => {
  players.forEach((player) => {
    scene.add(player.mesh);
  });
};
