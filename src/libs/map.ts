import * as THREE from "three";
import { Collidable, GameObject } from "@core/game-object";
import { DummyTarget } from "./target-dummy";
import { GameObjectTypes } from "@types";

/**
 * Positions a game object above the ground based on its height.
 * @param gameObject - The game object to position.
 * @param objectHeight - The height of the object.
 */
export const placeObjectAboveGround = (
  gameObject: GameObject,
  objectHeight: number
): void => {
  gameObject.mesh.position.set(0, objectHeight / 2, -8);
};

/**
 * Creates walls for the map.
 * @returns An array of THREE.Mesh instances representing the walls.
 */
const createWalls = (): THREE.Mesh[] => {
  const walls: THREE.Mesh[] = [];
  const wallMaterial = new THREE.MeshBasicMaterial({ color: 0x888888 });

  // Front wall
  const shortSideWallGeometry = new THREE.BoxGeometry(10, 3, 0.5);
  const frontWall = new Collidable({
    geometry: shortSideWallGeometry,
    material: wallMaterial,
    type: GameObjectTypes.Wall,
    instructions: [
      (gameObject: GameObject) =>
        gameObject.mesh.position.set(0, 1.5, -10),
    ],
  });
  walls.push(frontWall.mesh);

  // Back wall
  const backWall = new Collidable({
    geometry: shortSideWallGeometry,
    material: wallMaterial,
    type: GameObjectTypes.Wall,
    instructions: [
      (gameObject: GameObject) =>
        gameObject.mesh.position.set(0, 1.5, 10),
    ],
  });
  walls.push(backWall.mesh);

  // Left wall
  const longSideWallGeometry = new THREE.BoxGeometry(0.5, 3, 20);
  const leftWall = new Collidable({
    geometry: longSideWallGeometry,
    material: wallMaterial,
    type: GameObjectTypes.Wall,
    instructions: [
      (gameObject: GameObject) =>
        gameObject.mesh.position.set(-5, 1.5, 0),
    ],
  });
  walls.push(leftWall.mesh);

  // Right wall
  const rightWall = new Collidable({
    geometry: longSideWallGeometry,
    material: wallMaterial,
    type: GameObjectTypes.Wall,
    instructions: [
      (gameObject: GameObject) =>
        gameObject.mesh.position.set(5, 1.5, 0),
    ],
  });
  walls.push(rightWall.mesh);

  return walls;
};

/**
 * Creates a simple map with ground, walls, ambient light, and a target.
 * @returns A THREE.Group representing the map.
 */
export const createMap = (): THREE.Group => {
  // Ambient light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);

  // Ground
  const groundGeometry = new THREE.BoxGeometry(100, 0.1, 100);
  const groundMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    side: THREE.DoubleSide,
  });
  const ground = new Collidable({
    geometry: groundGeometry,
    material: groundMaterial,
    type: GameObjectTypes.Ground,
  });

  // Walls
  const walls = createWalls();

  // Target with instruction to position above ground
  const target = new DummyTarget({
    geometry: new THREE.BoxGeometry(1, 1, 1),
    material: new THREE.MeshBasicMaterial({ color: 0x0000ff }).clone(),
    instructions: [
      (gameObject: GameObject) => placeObjectAboveGround(gameObject, 1),
    ],
  });

  // Assemble the map
  const map = new THREE.Group();
  map.add(ambientLight, ground.mesh, ...walls, target.mesh);

  return map;
};

// Uncomment the lines below if you need to export default map instances
// const defaultMap = createMap();
// const maps = [defaultMap];
// export const getMap = (mapIndex: number): THREE.Group => maps[mapIndex];
