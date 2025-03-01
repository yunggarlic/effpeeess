import * as THREE from "three";
import { io } from "socket.io-client";
import { move } from "@libs/movement";
import { gameState } from "@core/state";
import { addListeners } from "./listeners/listeners";
import { setupSocketListeners } from "./listeners/sockets";
import { buildScene } from "@libs/scene";
import { localPlayer as player } from "@libs/player";
import { MOVE_SPEED } from "@core/constants";
import { createMap } from "@libs/map";

buildScene(gameState.scene, [createMap(), player.controls.object, player.mesh]);

// --- Socket.IO Setup ---

setupSocketListeners({
  socket: io(),
  scene: gameState.scene,
  otherPlayers: gameState.otherPlayers,
  player,
});

// --- Bullet (Shooting) Implementation ---
interface Bullet {
  mesh: THREE.Mesh;
  velocity: THREE.Vector3;
  distanceTraveled: number;
}

const bullets: Bullet[] = [];
const bulletSpeed = 20; // units per second
const bulletMaxDistance = 50; // maximum distance before bullet disappears

function shoot() {
  const bulletGeometry = new THREE.SphereGeometry(0.05, 8, 8);
  const bulletMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
  const bulletMesh = new THREE.Mesh(bulletGeometry, bulletMaterial);

  // Get the gun's world position and set the bullet there
  const gunWorldPos = new THREE.Vector3();
  gunMesh.getWorldPosition(gunWorldPos);
  bulletMesh.position.copy(gunWorldPos);

  // Determine the forward direction from the camera
  const direction = new THREE.Vector3();
  player.camera.getWorldDirection(direction);
  const velocity = direction.multiplyScalar(bulletSpeed);

  const bullet: Bullet = {
    mesh: bulletMesh,
    velocity,
    distanceTraveled: 0,
  };

  gameState.scene.add(bulletMesh);
  bullets.push(bullet);
}

document.addEventListener("mousedown", (event: MouseEvent) => {
  if (event.button === 0) {
    shoot();
  }
});

function updateBullets(delta: number) {
  for (let i = bullets.length - 1; i >= 0; i--) {
    const bullet = bullets[i];
    const movement = bullet.velocity.clone().multiplyScalar(delta);
    bullet.mesh.position.add(movement);
    bullet.distanceTraveled += movement.length();

    // Remove bullet if it exceeds maximum travel distance
    if (bullet.distanceTraveled > bulletMaxDistance) {
      gameState.scene.remove(bullet.mesh);
      bullets.splice(i, 1);
      continue;
    }

    // Create a small bounding sphere for the bullet
    const bulletSphere = new THREE.Sphere(bullet.mesh.position.clone(), 0.05);

    // Check collision with walls
    for (const wall of walls) {
      const wallBox = new THREE.Box3().setFromObject(wall);
      if (wallBox.intersectsSphere(bulletSphere)) {
        gameState.scene.remove(bullet.mesh);
        bullets.splice(i, 1);
        break;
      }
    }

    // Check collision with target
    const targetBox = new THREE.Box3().setFromObject(targetMesh);
    if (targetBox.intersectsSphere(bulletSphere)) {
      gameState.scene.remove(bullet.mesh);
      bullets.splice(i, 1);
      // Indicate a hit by changing the target's color
      targetMesh.material = new THREE.MeshBasicMaterial({ color: 0xff00ff });
      continue;
    }
  }
}

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

  move(player.controls, gameState.keysPressed, player, MOVE_SPEED);
  // updateBullets(delta);
  gameState.renderer.render(gameState.scene, player.camera);
}
animate();
