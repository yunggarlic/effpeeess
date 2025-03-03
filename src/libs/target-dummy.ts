import { Collidable, GameObject } from "@core/game-object";
import * as THREE from "three";
import { placeObjectAboveGround } from "./map";

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
    (this.mesh.material as THREE.MeshStandardMaterial).color.set(0xff0000);
    this.initiateRespawn();
  }

  initiateRespawn() {
    setTimeout(() => {
      setTimeout(() => {
        const target = new DummyTarget(getDummyTargetProps(this.dummyType));
        target.addToScene();
      }, 1000);
      this.destroy();
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
