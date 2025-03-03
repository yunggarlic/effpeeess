import * as THREE from "three";
import { GameObject } from "@core/game-object";
import { LocalPlayer } from "./player";

export const buildScene = (
  scene: THREE.Scene,
  map: THREE.Group,
  player: LocalPlayer
) => {
  map.add(player.mesh);
  map.add(player.controls.object);

  // load lobby players
  // addPlayersToScene(map, gameState.lobbyPlayers);
  scene.add(map);
};

export const addPlayersToScene = (map: THREE.Group, players: GameObject[]) => {
  players.forEach((player) => {
    map.add(player.mesh);
  });
};
