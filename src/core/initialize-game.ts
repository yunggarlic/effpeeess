import { gameState } from "./state";
import { setupSocketListeners } from "@listeners/sockets";
import { addListeners } from "@listeners/listeners";
import { buildScene } from "@libs/scene";
import { createMap } from "@libs/map";
import { animate } from "./animate";

export function initialize() {
  if (!gameState.localPlayer) {
    throw new Error("Local player not set");
  }
  setupSocketListeners({
    scene: gameState.scene,
    otherPlayers: gameState.otherPlayers,
    localPlayer: gameState.localPlayer,
  });

  addListeners({
    renderer: gameState.renderer,
    camera: gameState.localPlayer.camera,
    keysPressed: gameState.keysPressed,
    controls: gameState.localPlayer.controls,
  });

  // Create the map **only once**
  const map = createMap();
  map.gameObjects.push(gameState.localPlayer);
  map.mapGroup.add(gameState.localPlayer.mesh);
  map.mapGroup.add(gameState.localPlayer.controls.object);
  
  buildScene(gameState.scene, map); // Use the same map
  
  // --- Unified Animation Loop ---
  animate();
}



