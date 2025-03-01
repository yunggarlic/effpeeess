import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";
import { Player } from "./player";

export function move(
  controls: PointerLockControls,
  keysPressed: Record<string, boolean>,
  player: Player,
  moveSpeed: number
) {
  if (controls.isLocked) {
    const direction = new THREE.Vector3();
    if (keysPressed["w"]) direction.z += moveSpeed;
    if (keysPressed["s"]) direction.z -= moveSpeed;
    if (keysPressed["a"]) direction.x -= moveSpeed;
    if (keysPressed["d"]) direction.x += moveSpeed;
    controls.moveRight(direction.x);
    controls.moveForward(direction.z);
    player.mesh.position.copy(controls.object.position);
  }
}
