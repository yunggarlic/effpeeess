import { gameState } from "./state";
import { updateBullets } from "@libs/bullets";

export function animate() {
  if (!gameState.localPlayer) {
    throw new Error("Local player not set");
  }

  requestAnimationFrame(animate);
  const delta = gameState.clock.getDelta();

  updateBullets(delta);
  gameState.localPlayer.move(delta);

  gameState.renderer.render(gameState.scene, gameState.localPlayer.camera);
}
