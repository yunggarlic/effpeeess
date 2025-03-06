import { Collidable, GameObject } from "@core/game-object";
import * as THREE from "three";
import { placeObjectAboveGround } from "./map";
import { gameState } from "@core/state";

interface DummyTargetProps {
  geometry: THREE.BoxGeometry;
  material: THREE.MeshBasicMaterial;
  instructions: Function[];
  dummyType?: DummyTargetTypes;
}

export class DummyTarget extends Collidable {
  dummyType: DummyTargetTypes;
  constructor({
    geometry,
    material,
    instructions,
    dummyType = DummyTargetTypes.Default,
  }: DummyTargetProps) {
    super({
      geometry,
      material,
      instructions,
    });
    this.dummyType = dummyType;
  }

  hit() {
    if (!this.mesh.parent) {
      console.warn("Hit detected on an object not in the scene!");
      return; // Ignore hits on objects not in the scene
    }

    if (!Array.isArray(this.mesh.material)) {
      const mat = this.mesh.material;
      if (mat instanceof THREE.MeshBasicMaterial) {
        mat.color.set(0xff0000);
      }
    } else {
      console.error(
        "NotImplementedError: Target dummy hit not implemented for multiple or non-basic materials"
      );
    }
    this.initiateRespawn();
  }

  initiateRespawn() {
    setTimeout(() => {
      this.destroy(); // Ensure old instance is removed before spawning a new one

      setTimeout(() => {
        const target = new DummyTarget(getDummyTargetProps(this.dummyType));
        target.addToScene();
      }, 1000);
    }, 1000);
  }
}

export enum DummyTargetTypes {
  Default = "Default",
}

export const DefaultTargetDummyProps = {
  geometry: new THREE.BoxGeometry(1, 1, 1),
  material: new THREE.MeshBasicMaterial(),
  instructions: [
    (gameObject: GameObject) => {
      (gameObject.mesh.material as THREE.MeshBasicMaterial).color.set(0x0000ff);
      placeObjectAboveGround(gameObject, 1);
    },
  ],
};

export const getDummyTargetProps = (dummyType: DummyTargetTypes) => {
  switch (dummyType) {
    case DummyTargetTypes.Default:
      return DefaultTargetDummyProps;
    default:
      return DefaultTargetDummyProps;
  }
};
