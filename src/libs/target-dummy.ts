import { Collidable, GameObject } from "@core/game-object";
import * as THREE from "three";
import { placeObjectAboveGround } from "./map";

interface DummyTargetProps {
  geometry: THREE.BoxGeometry;
  material: THREE.MeshBasicMaterial;
  instructions: Function[];
}

export const DefaultTargetDummyProps = {
  geometry: new THREE.BoxGeometry(1, 1, 1),
  material: new THREE.MeshBasicMaterial(),
  instructions: [
    (gameObject: GameObject) => {
      gameObject.mesh.material.color.set(0x0000ff);
      placeObjectAboveGround(gameObject, 1);
    },
  ],
};

export class DummyTarget extends Collidable {
  constructor({ geometry, material, instructions }: DummyTargetProps) {
    super({
      geometry,
      material,
      instructions,
    });
  }

  hit() {
    (this.mesh.material as THREE.MeshStandardMaterial).color.set(0xff0000);
    this.initiateRespawn();
  }

  initiateRespawn() {
    setTimeout(() => {
      setTimeout(() => {
        const target = new DummyTarget(DefaultTargetDummyProps);
        target.addToScene();
      }, 1000);
      this.destroy();
    }, 1000);
  }
}
