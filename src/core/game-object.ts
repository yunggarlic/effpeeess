import * as THREE from "three";

interface GameObjectProps<G extends THREE.BufferGeometry> {
  geometry: G;
  material: THREE.Material;
  instructions?: Function[];
}

export class GameObject {
  mesh: THREE.Mesh;
  constructor({ geometry, material, instructions }: GameObjectProps<any>) {
    this.mesh = new THREE.Mesh(geometry, material);

    if (instructions) {
      instructions.forEach((instruction) => instruction(this));
    }
  }
}
