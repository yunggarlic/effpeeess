import * as THREE from "three";
import { GameObject } from "@core/game-object";
import { Map } from "./map";
import { gameState } from "@core/state";

export const buildScene = (
  scene: THREE.Scene,
  map: Map,
) => {
  map.gameObjects.forEach((gameObject) => gameState.objectManager.add(gameObject));

  // load lobby players
  // addPlayersToScene(map, gameState.lobbyPlayers);
  scene.add(map.mapGroup);
};

export const addPlayersToScene = (map: THREE.Group, players: GameObject[]) => {
  players.forEach((player) => {
    map.add(player.mesh);
  });
};
