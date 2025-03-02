import * as THREE from "three";
import { Collidable, GameObject } from "@core/game-object";
import { DummyTarget } from "./target-dummy";

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
  const ground = new Collidable({
    geometry: groundGeometry,
    material: groundMaterial,
    instructions: [
      (gameObject: GameObject) => (gameObject.mesh.rotation.x = -Math.PI / 2),
    ],
  });

  // --- Walls ---
  const walls: THREE.Mesh[] = [];
  createWalls(walls);

  const target = new DummyTarget({
    geometry: new THREE.BoxGeometry(1, 1, 1),
    material: new THREE.MeshBasicMaterial({ color: 0x0000ff }),
    instructions: [
      (gameObject: GameObject) => placeObjectAboveGround(gameObject, 1),
    ],
  });

  const map = new THREE.Group();
  map.add(ambientLight, ground.mesh, ...walls, target.mesh);

  return map;
};

const createWalls = (walls: any) => {
  // Front wall
  const wallMaterial = new THREE.MeshBasicMaterial({ color: 0x888888 });

  const shortSideWallGeometry = new THREE.BoxGeometry(10, 3, 0.5);

  const wallFront = new Collidable({
    geometry: shortSideWallGeometry,
    material: wallMaterial,
    instructions: [
      (gameObject: GameObject) => gameObject.mesh.position.set(0, 1.5, -10),
    ],
  });

  walls.push(wallFront.mesh);

  // Back wall
  const wallBack = new Collidable({
    geometry: shortSideWallGeometry,
    material: wallMaterial,
    instructions: [
      (gameObject: GameObject) => gameObject.mesh.position.set(0, 1.5, 10),
    ],
  });
  walls.push(wallBack.mesh);

  // Left wall
  const longSideWallGeometry = new THREE.BoxGeometry(0.5, 3, 20);
  const wallLeft = new Collidable({
    geometry: longSideWallGeometry,
    material: wallMaterial,
    instructions: [
      (gameObject: GameObject) => gameObject.mesh.position.set(-5, 1.5, 0),
    ],
  });

  walls.push(wallLeft.mesh);

  // Right wall
  const wallRight = new Collidable({
    geometry: longSideWallGeometry,
    material: wallMaterial,
    instructions: [
      (gameObject: GameObject) => gameObject.mesh.position.set(5, 1.5, 0),
    ],
  });
  walls.push(wallRight.mesh);
};
