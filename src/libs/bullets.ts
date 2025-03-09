import * as THREE from "three";
import { gameState } from "@core/state";
import { Collidable } from "@core/game-object";
import { GameObjectTypes } from "@types";

interface BulletProps {
  geometry: THREE.SphereGeometry;
  material: THREE.MeshBasicMaterial;
}

enum BulletType {
  Standard,
}

export class Bullet extends Collidable {
  velocity: THREE.Vector3;
  distanceTraveled: number;
  originator: THREE.Vector3;
  constructor(
    { geometry, material }: BulletProps,
    velocity: THREE.Vector3,
    originator: THREE.Vector3
  ) {
    super({
      geometry,
      material,
      isCollidable: true,
      type: GameObjectTypes.Bullet,
    });
    this.velocity = velocity;
    this.originator = originator;
    this.distanceTraveled = 0;
    this.mesh.position.copy(originator);
    gameState.scene.add(this.mesh);
    gameState.objectManager.add(this);
  }

  updateDistanceTraveled(delta: number) {
    const movement = this.velocity.clone().multiplyScalar(delta);
    this.mesh.position.add(movement);
    this.distanceTraveled += movement.length();
  }

  setVelocity(velocity: THREE.Vector3) {
    this.velocity = velocity;
  }

  create() {
    gameState.scene.add(this.mesh);
    gameState.objectManager.add(this);
  }
}

export function updateBullets(delta: number) {
  for (let i = gameState.objectManager.bullets.length - 1; i >= 0; i--) {
    const bullet = gameState.objectManager.getGameObjectById(
      gameState.objectManager.bullets[i]
    ) as Bullet;
    const movement = bullet.velocity.clone().multiplyScalar(delta);
    bullet.mesh.position.add(movement);
    bullet.distanceTraveled += movement.length();

    // Remove bullet if it exceeds maximum travel distance
    if (bullet.distanceTraveled > gameState.configuration.bulletMaxDistance) {
      gameState.scene.remove(bullet.mesh);
      gameState.objectManager.bullets.splice(i, 1);
      continue;
    }

    // Create a small bounding sphere for the bullet
    const bulletSphere = new THREE.Sphere(bullet.mesh.position.clone(), 0.05);

    // Check collision with walls
    for (const collidable of gameState.objectManager.collidables) {
      const collidableObject = gameState.objectManager.getGameObjectById(
        collidable
      ) as Collidable;
      const collidableBox = new THREE.Box3().setFromObject(
        collidableObject.mesh
      );
      if (collidableBox.intersectsSphere(bulletSphere)) {
        gameState.scene.remove(bullet.mesh);
        gameState.objectManager.bullets.splice(i, 1);
        collidableObject.hit();
        break;
      }
    }
  }
}

export const getBulletProps = (type?: BulletType) => {
  switch (type) {
    case BulletType.Standard:
    default:
      return {
        geometry: new THREE.SphereGeometry(0.05, 8, 8),
        material: new THREE.MeshBasicMaterial({ color: 0xffff00 }),
      };
  }
};
