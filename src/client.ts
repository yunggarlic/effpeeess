import { gameState } from "@core/state";
import { localPlayer } from "@libs/player";
import { initialize } from "@core/initialize-game";

gameState.setLocalPlayer(localPlayer);
if (!gameState.localPlayer) {
  throw new Error("Local player not set");
}

initialize();
