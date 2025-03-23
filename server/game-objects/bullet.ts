import { ObjectManagerAcceptableTypes } from "server/game-state/object-manager";
import { GameObject } from "./game-object";
import * as THREE from "three";
import { gameState } from "server/game-state/game-state";
import { Collidable } from "./collidable";
import { BulletMesh } from "./meshes";
import { BulletMeshOptions } from "./meshes/bullets";

interface BulletConstructor {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  meshIndex?: number;
}

export class Bullet extends GameObject {
  public position: THREE.Vector3;
  public velocity: THREE.Vector3;
  public meshId: BulletMeshOptions.Default;
  public mesh: THREE.Mesh;
  public distanceTraveled: number = 0;

  constructor({ position, velocity, meshIndex }: BulletConstructor) {
    super({ type: ObjectManagerAcceptableTypes.Bullet });
    this.position = position;
    this.velocity = velocity;
    this.meshId = BulletMeshOptions.Default;
    this.mesh = new BulletMesh[BulletMeshOptions.Default]();
  }

  checkCollision(collidableObject: Collidable) {
    const bulletSphere = new THREE.Sphere(this.position.clone(), 0.05);
    const collidableBox = new THREE.Box3().setFromObject(
      this.mesh || Bullet.defaultBulletMesh
    );
    if (collidableBox.intersectsSphere(bulletSphere)) {
      gameState.objectManager.remove(this.id);
      collidableObject.hit();
    }
  }

  update(delta: number) {
    const movement = this.velocity.clone().multiplyScalar(delta);
    this.position.add(movement);
    this.distanceTraveled += movement.length();

    if (this.distanceTraveled > gameState.configuration.bulletMaxDistance) {
      gameState.objectManager.remove(this.id);
    }
  }

  getState() {
    return {
      id: this.id,
      position: this.position,
      velocity: this.velocity,
      distanceTraveled: this.distanceTraveled,
    };
  }
}

const bulletMeshes = [Bullet.defaultBulletMesh];
