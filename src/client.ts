import * as THREE from "three";
import { io } from "socket.io-client";
import { move } from "@libs/movement";
import { gameState } from "@core/state";
import { addListeners } from "./listeners/listeners";
import { setupSocketListeners } from "./listeners/sockets";
import { buildScene } from "@libs/scene";
import { LocalPlayer, localPlayer as player } from "@libs/player";
import { MOVE_SPEED } from "@core/constants";
import { createMap } from "@libs/map";
import { updateBullets } from "@libs/bullets";

buildScene(gameState.scene, [createMap(), player.controls.object, player.mesh]);

// --- Socket.IO Setup ---

setupSocketListeners({
  socket: io(),
  scene: gameState.scene,
  otherPlayers: gameState.otherPlayers,
  player,
});


addListeners({
  renderer: gameState.renderer,
  camera: player.camera,
  keysPressed: gameState.keysPressed,
  controls: player.controls,
});

// --- Unified Animation Loop ---
let lastTime = performance.now();
function animate() {
  requestAnimationFrame(animate);
  const now = performance.now();
  const delta = (now - lastTime) / 1000;
  lastTime = now;

  updateBullets(delta)

  move(player.controls, gameState.keysPressed, player, MOVE_SPEED);
  // updateBullets(delta);
  gameState.renderer.render(gameState.scene, player.camera);
}
animate();
