import { GameObjectTypes } from "@types";
import * as THREE from "three";
import { gameState } from "./state";

export type ParameterizedBufferGeometry =
  | THREE.BoxGeometry
  | THREE.CapsuleGeometry
  | THREE.CircleGeometry
  | THREE.ConeGeometry
  | THREE.CylinderGeometry
  | THREE.DodecahedronGeometry
  | THREE.ExtrudeGeometry
  | THREE.IcosahedronGeometry
  | THREE.LatheGeometry
  | THREE.OctahedronGeometry
  | THREE.PlaneGeometry
  | THREE.PolyhedronGeometry
  | THREE.RingGeometry
  | THREE.ShapeGeometry
  | THREE.SphereGeometry
  | THREE.TetrahedronGeometry
  | THREE.TorusGeometry
  | THREE.TorusKnotGeometry
  | THREE.TubeGeometry;

// 2) Use that union to ensure geometry.parameters is recognized
export interface GameObjectProps<G extends ParameterizedBufferGeometry> {
  geometry: G;
  material: THREE.Material;
  instructions?: Function[];
  isCollidable?: boolean;
  type?: string | null;
}

export class GameObject {
  mesh: THREE.Mesh;
  isCollidable: boolean;
  type: string | null;
  constructor({
    geometry,
    material,
    instructions,
    isCollidable = false,
    type = null,
  }: GameObjectProps<any>) {
    this.mesh = new THREE.Mesh(geometry, material);
    this.isCollidable = isCollidable;
    this.type = type;
    if (instructions) {
      instructions.forEach((instruction) => instruction(this));
    }

    gameState.objectManager.add(this);
  }

  addToScene() {
    gameState.scene.add(this.mesh);
  }

  destroy() {
    gameState.objectManager.remove(this);
    this.mesh.removeFromParent();
  }
}

export class Collidable extends GameObject {
  constructor({
    geometry,
    material,
    instructions,
    type = GameObjectTypes.Collidable,
  }: GameObjectProps<any>) {
    super({ geometry, material, instructions, isCollidable: true, type });
  }

  hit() {
    console.error(`hit() method not implemented for ${this.constructor.name}`);
  }
}
