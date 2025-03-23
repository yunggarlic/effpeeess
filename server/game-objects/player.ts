import * as THREE from "three";
import { GameObject } from "./game-object";
import { ObjectManagerAcceptableTypes } from "server/game-state/object-manager";
import { PlayerMesh } from "./meshes";
import { PlayerMeshOptions } from "./meshes/players";

export type PlayerConstructor = {
  multiplayerId: string;
  materialId?: number;
  geometryId?: number;
};

export class Player extends GameObject {
  public multiplayerId: string;
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  worldDirection: THREE.Vector3;
  rotation: THREE.Quaternion;
  mesh: THREE.Mesh;
  meshId: PlayerMeshOptions;
  lastUpdateTime: number;
  constructor({ multiplayerId }: PlayerConstructor) {
    super({ type: ObjectManagerAcceptableTypes.Player });
    this.multiplayerId = multiplayerId;
    this.position = new THREE.Vector3();
    this.velocity = new THREE.Vector3();
    this.worldDirection = new THREE.Vector3();
    this.rotation = new THREE.Quaternion(0, 0, 0, 1);
    this.meshId = PlayerMeshOptions.Default;
    this.mesh = new PlayerMesh[this.meshId]();
    this.lastUpdateTime = Date.now();
  }

  updateMesh(meshId: PlayerMeshOptions) {
    this.meshId = meshId;
    this.mesh = new PlayerMesh[this.meshId]();
  }
  updateRotation(x: number, y: number, z: number, w: number): THREE.Quaternion {
    return this.rotation.set(x, y, z, w);
  }
  updatePosition(x: number, y: number, z: number): THREE.Vector3 {
    return this.position.set(x, y, z);
  }
  updateWorldDirection(x: number, y: number, z: number) {
    this.worldDirection.set(x, y, z);
  }
  getState() {
    return {
      id: this.multiplayerId,
      position: this.position,
      velocity: this.velocity,
      rotation: this.rotation,
      meshId: this.meshId,
      lastUpdateTime: this.lastUpdateTime,
    };
  }
}
