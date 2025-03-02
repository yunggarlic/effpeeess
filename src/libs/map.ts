import * as THREE from "three";
import { gameState } from "../core/state";
import { GameObject } from "@core/game-object";

export const placeObjectAboveGround = (
  gameObject: GameObject,
  objectHeight: number
) => {
  gameObject.mesh.position.set(0, objectHeight / 2, -8);
};

export const createMap = (): THREE.Group => {
  // --- Three.js Scene Setup ---
  // Ambient light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);

  // --- Create a simple ground plane ---
  const groundGeometry = new THREE.PlaneGeometry(100, 100);
  const groundMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    side: THREE.DoubleSide,
  });
  const ground = new GameObject({
    geometry: groundGeometry,
    material: groundMaterial,
    isCollidable: true,
  });

  // const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.mesh.rotation.x = -Math.PI / 2;

  // --- Walls ---
  const walls: THREE.Mesh[] = [];
  createWalls(walls);

  const target = new GameObject({
    geometry: new THREE.BoxGeometry(1, 1, 1),
    material: new THREE.MeshBasicMaterial({ color: 0x0000ff }),
    instructions: [
      (gameObject: GameObject) => placeObjectAboveGround(gameObject, 1),
    ],
    isCollidable: true,
  });

  const map = new THREE.Group();
  map.add(ambientLight, ground.mesh, ...walls, target.mesh);

  return map;
};

const createWalls = (walls: any) => {
  // Front wall
  const wallMaterial = new THREE.MeshBasicMaterial({ color: 0x888888 });
  const wallFrontGeometry = new THREE.BoxGeometry(10, 3, 0.5);
  const wallFront = new THREE.Mesh(wallFrontGeometry, wallMaterial);
  wallFront.position.set(0, 1.5, -10);
  gameState.scene.add(wallFront);
  walls.push(wallFront);

  // Back wall
  const wallBackGeometry = new THREE.BoxGeometry(10, 3, 0.5);
  const wallBack = new THREE.Mesh(wallBackGeometry, wallMaterial);
  wallBack.position.set(0, 1.5, 10);
  gameState.scene.add(wallBack);
  walls.push(wallBack);

  // Left wall
  const wallLeftGeometry = new THREE.BoxGeometry(0.5, 3, 20);
  const wallLeft = new THREE.Mesh(wallLeftGeometry, wallMaterial);
  wallLeft.position.set(-5, 1.5, 0);
  gameState.scene.add(wallLeft);
  walls.push(wallLeft);

  // Right wall
  const wallRightGeometry = new THREE.BoxGeometry(0.5, 3, 20);
  const wallRight = new THREE.Mesh(wallRightGeometry, wallMaterial);
  wallRight.position.set(5, 1.5, 0);
  gameState.scene.add(wallRight);
  walls.push(wallRight);
};
