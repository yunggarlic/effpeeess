import { GameObjectTypes } from "@types";
import * as THREE from "three";
import { gameState } from "./state";

export interface GameObjectProps<G extends THREE.BufferGeometry> {
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
