import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";
import { cameraSettings } from "../core/constants";
import { v4 as uuidv4 } from "uuid";
import { Collidable, ParameterizedBufferGeometry } from "@core/game-object";
import { gameState } from "@core/state";
import { Bullet, getBulletProps } from "./bullets";
import { GameObjectTypes } from "@types";

/**
 * Computes an approximate collision normal based on the closest face of the box.
 * Compares the intersection point with the box's min and max on the X and Z axes.
 * @param box - The bounding box of the collidable.
 * @param point - The intersection point.
 * @returns A normalized vector representing the collision normal.
 */
function computeBoxFaceNormal(
  box: THREE.Box3,
  point: THREE.Vector3
): THREE.Vector3 {
  let bestNormal = new THREE.Vector3();
  let minDistance = Infinity;

  // Create an array of face data: each face has a normal and the distance from the point to that face.
  const faces = [
    {
      normal: new THREE.Vector3(-1, 0, 0),
      distance: Math.abs(point.x - box.min.x),
    },
    {
      normal: new THREE.Vector3(1, 0, 0),
      distance: Math.abs(box.max.x - point.x),
    },
    {
      normal: new THREE.Vector3(0, 0, -1),
      distance: Math.abs(point.z - box.min.z),
    },
    {
      normal: new THREE.Vector3(0, 0, 1),
      distance: Math.abs(box.max.z - point.z),
    },
  ];

  for (const face of faces) {
    if (face.distance < minDistance) {
      minDistance = face.distance;
      bestNormal.copy(face.normal);
    }
  }
  return bestNormal;
}

interface PlayerProps {
  id: string;
  mesh: THREE.Mesh;
  isOtherPlayer?: boolean;
  geometry?: ParameterizedBufferGeometry;
  material?: THREE.MeshBasicMaterial;
  gunMeshId?: string;
}

export class Player extends Collidable {
  id: string;
  mesh: THREE.Mesh;
  isOtherPlayer: boolean = false;
  gunMeshId: number;
  constructor({
    id,
    mesh,
    isOtherPlayer = false,
    geometry = new THREE.BoxGeometry(1, 2, 1),
    material = new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
  }: PlayerProps) {
    super({ geometry, material, type: GameObjectTypes.Player });
    this.id = id;
    this.mesh = mesh ?? new THREE.Mesh(geometry, material);
    this.isOtherPlayer = isOtherPlayer;
    this.gunMeshId = -1;
    this.type = GameObjectTypes.Player;

    this.mesh.position.y = 0.5;
    this.addGunMesh();
  }

  setGunMeshId(gunMeshId: number) {
    this.gunMeshId = gunMeshId;
  }

  addGunMesh(): THREE.Mesh | void {
    const gunGeometry = new THREE.BoxGeometry(0.3, 0.2, 1);
    const gunMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const gunMesh = new THREE.Mesh(gunGeometry, gunMaterial);
    gunMesh.position.set(0.4, -0.3, -1);
    this.setGunMeshId(gunMesh.id);

    this.mesh.add(gunMesh);
    return gunMesh;
  }

  updatePosition(x: number, y: number, z: number): THREE.Vector3 {
    return this.mesh.position.set(x, y, z);
  }

  getWorldDirection(): THREE.Vector3 {
    return this.mesh.getWorldDirection(new THREE.Vector3());
  }

  shoot(): Bullet | undefined {
    const gunMesh = this.getGunMesh();

    if (!gunMesh) {
      console.error("Gun mesh not found");
      return;
    }

    // Determine the forward direction from the player's world position;
    return new Bullet(
      getBulletProps(),
      this.getWorldDirection().multiplyScalar(
        gameState.configuration.bulletSpeed
      ),
      gunMesh.getWorldPosition(new THREE.Vector3())
    );
  }

  getGunMesh() {
    return this.mesh.getObjectById(this.gunMeshId);
  }
}

export class LocalPlayer extends Player {
  controls: PointerLockControls;
  camera: THREE.PerspectiveCamera;

  private velocityY = 0;
  private onGround = true;

  constructor({ id, mesh }: PlayerProps) {
    super({ id, mesh });
    this.camera = new THREE.PerspectiveCamera(...cameraSettings.getShit());
    this.camera?.position.set(0, 2, 5);
    this.controls = new PointerLockControls(this.camera, document.body);
    this.addGunMesh();
    this.setupListeners();
  }

  addGunMesh(): THREE.Mesh | void {
    if (this.controls) {
      const gunGeometry = new THREE.BoxGeometry(0.3, 0.2, 1);
      const gunMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
      const gunMesh = new THREE.Mesh(gunGeometry, gunMaterial);
      gunMesh.position.set(0.4, -0.3, -1);
      this.setGunMeshId(gunMesh.id);
      this.controls.object.add(gunMesh);
      return gunMesh;
    }
  }

  setGunMeshId(id: number) {
    this.gunMeshId = id;
  }

  getGunMesh() {
    return this.controls.object.getObjectById(this.gunMeshId);
  }
  getWorldDirection() {
    return this.camera.getWorldDirection(new THREE.Vector3());
  }

  setupListeners() {
    document.addEventListener("mousedown", (event: MouseEvent) => {
      if (event.button === 0) {
        this.shoot();
      }
    });
  }

  /**
   * Moves the player with swept collision detection to allow sliding along walls
   * and uses multiple vertical rays for a more forgiving edge and surface detection.
   */
  move(deltaTime: number) {
    if (!this.controls.isLocked) return;

    const moveSpeed = gameState.configuration.moveSpeed;

    // --- Compute Camera-Relative Horizontal Movement ---
    const forward = new THREE.Vector3();
    this.camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();

    const right = new THREE.Vector3();
    right.crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();

    let moveForward = 0;
    let moveRight = 0;
    if (gameState.keysPressed["w"]) moveForward += 1;
    if (gameState.keysPressed["s"]) moveForward -= 1;
    if (gameState.keysPressed["d"]) moveRight += 1;
    if (gameState.keysPressed["a"]) moveRight -= 1;

    // Build the full horizontal movement vector.
    const movement3D = new THREE.Vector3();
    movement3D.add(forward.clone().multiplyScalar(moveForward));
    movement3D.add(right.clone().multiplyScalar(moveRight));
    if (movement3D.lengthSq() > 0) movement3D.normalize();
    movement3D.multiplyScalar(moveSpeed * deltaTime);

    // --- Handle Vertical Movement (Jump/Gravity) ---
    if (gameState.keysPressed[" "] && this.onGround) {
      this.velocityY = gameState.configuration.jumpForce;
      this.onGround = false;
    }
    this.velocityY -= gameState.configuration.gravity * deltaTime;

    // --- Horizontal Collision Resolution (Iterative Swept Collision) ---
    const skinOffset = 0.05;
    const maxIterations = 3;
    let currentPosition = this.controls.object.position.clone();
    let remainingMovement = movement3D.clone();

    for (
      let i = 0;
      i < maxIterations && remainingMovement.lengthSq() > 0.0001;
      i++
    ) {
      const collision = this.raycastCollision(
        currentPosition,
        remainingMovement
      );
      if (collision) {
        const allowedDistance = Math.max(collision.distance - skinOffset, 0);
        const allowedMovement = remainingMovement
          .clone()
          .normalize()
          .multiplyScalar(allowedDistance);
        currentPosition.add(allowedMovement);

        remainingMovement.sub(allowedMovement);
        remainingMovement = remainingMovement.projectOnPlane(collision.normal);
      } else {
        currentPosition.add(remainingMovement);
        remainingMovement.set(0, 0, 0);
      }
    }

    // --- Vertical Collision Resolution ---
    // Define the player's half-height and the ground level (player center when standing).
    const halfHeight = 1.0;
    const groundLevel = 1.05; // Adjust this based on your ground mesh's height.

    let proposedY =
      this.controls.object.position.y + this.velocityY * deltaTime;
    if (this.velocityY !== 0) {
      const directionY = Math.sign(this.velocityY);
      const verticalMovement = Math.abs(this.velocityY * deltaTime);
      const collisionCandidateY = this.castVerticalRays(
        currentPosition,
        directionY,
        verticalMovement,
        halfHeight
      );

      if (collisionCandidateY !== null) {
        proposedY = collisionCandidateY;
        this.velocityY = 0;
        if (directionY < 0) {
          this.onGround = true;
        }
      }
    }

    // --- Fallback: Prevent Falling Through the Ground ---
    if (this.velocityY <= 0 && proposedY < groundLevel) {
      proposedY = groundLevel;
      this.velocityY = 0;
      this.onGround = true;
    }

    currentPosition.y = proposedY;
    this.controls.object.position.copy(currentPosition);
    this.mesh.position.copy(this.controls.object.position);
  }

  /**
   * Casts multiple vertical rays from around the player's horizontal position to detect collisions.
   * For downward movement, returns the highest candidate Y value (i.e. the highest surface contacted).
   * For upward movement, returns the lowest candidate Y value (i.e. the lowest ceiling).
   *
   * @param position - The player's horizontal position after horizontal collision resolution.
   * @param direction - The vertical direction: -1 for falling, +1 for rising.
   * @param verticalMovement - The expected vertical movement (|velocityY * deltaTime|).
   * @param halfHeight - Half the height of the player's collision volume.
   * @returns The candidate Y position if a collision is detected, or null otherwise.
   */
  castVerticalRays(
    position: THREE.Vector3,
    direction: number,
    verticalMovement: number,
    halfHeight: number
  ): number | null {
    // Offsets along the horizontal plane. Adjust these if your player's footprint is larger.
    const offsets = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0.5, 0, 0),
      new THREE.Vector3(-0.5, 0, 0),
      new THREE.Vector3(0, 0, 0.5),
      new THREE.Vector3(0, 0, -0.5),
    ];

    let candidateY: number | null = null;
    for (const offset of offsets) {
      const rayOrigin = position.clone().add(offset);
      // For falling, cast from the bottom; for rising, from the top.
      if (direction < 0) {
        rayOrigin.y -= halfHeight;
      } else {
        rayOrigin.y += halfHeight;
      }
      const ray = new THREE.Ray(rayOrigin, new THREE.Vector3(0, direction, 0));

      for (const collidableId of gameState.objectManager.collidables) {
        const collidable =
          gameState.objectManager.getGameObjectById(collidableId);
        if (!collidable || collidable.mesh.id === this.mesh.id) continue;
        const box = new THREE.Box3().setFromObject(collidable.mesh);
        const intersectionPoint = new THREE.Vector3();
        if (ray.intersectBox(box, intersectionPoint)) {
          const distance = rayOrigin.distanceTo(intersectionPoint);
          if (distance <= verticalMovement) {
            // For falling, adjust so that the player's bottom sits on top of the object.
            // For rising, adjust so that the player's top is just below the object.
            const adjustedY =
              direction < 0 ? box.max.y + halfHeight : box.min.y - halfHeight;
            if (direction < 0) {
              // For falling, pick the highest surface.
              candidateY =
                candidateY === null
                  ? adjustedY
                  : Math.max(candidateY, adjustedY);
            } else {
              // For rising, pick the lowest ceiling.
              candidateY =
                candidateY === null
                  ? adjustedY
                  : Math.min(candidateY, adjustedY);
            }
          }
        }
      }
    }
    return candidateY;
  }

  /**
   * Casts multiple rays from various offsets around the player’s position along the movement direction.
   * Returns collision data if any of the rays detect a collision within the movement length.
   */
  raycastCollision(
    start: THREE.Vector3,
    movement: THREE.Vector3
  ): { distance: number; normal: THREE.Vector3 } | null {
    // Define offsets from the player's center.
    // Adjust `playerRadius` according to your player's dimensions.
    const playerRadius = 0.5;
    const offsets = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(playerRadius, -playerRadius, 0),
      new THREE.Vector3(-playerRadius, -playerRadius, 0),
      new THREE.Vector3(0, -playerRadius, playerRadius),
      new THREE.Vector3(0, -playerRadius, -playerRadius),
    ];

    let closestCollision: { distance: number; normal: THREE.Vector3 } | null =
      null;
    const movementLength = movement.length();

    for (const offset of offsets) {
      const rayOrigin = start.clone().add(offset);
      const ray = new THREE.Ray(rayOrigin, movement.clone().normalize());

      for (const collidableId of gameState.objectManager.collidables) {
        const collidable =
          gameState.objectManager.getGameObjectById(collidableId);
        if (!collidable || collidable.mesh.id === this.mesh.id) continue;
        // Skip ground objects.
        if (collidable.type === "Ground") continue;

        const box = new THREE.Box3().setFromObject(collidable.mesh);
        const intersectionPoint = new THREE.Vector3();
        if (ray.intersectBox(box, intersectionPoint)) {
          const distance = rayOrigin.distanceTo(intersectionPoint);
          if (distance <= movementLength) {
            // Compute the collision normal by determining which face of the box was hit.
            const normal = computeBoxFaceNormal(box, intersectionPoint);
            if (!closestCollision || distance < closestCollision.distance) {
              closestCollision = { distance, normal };
            }
          }
        }
      }
    }
    return closestCollision;
  }
}

export const localPlayer = new LocalPlayer({
  id: uuidv4(),
  mesh: new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 2, 0.5),
    new THREE.MeshBasicMaterial({ color: 0x0000ff })
  ),
});
