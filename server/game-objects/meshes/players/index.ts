import * as THREE from "three";

export class PlayerMesh extends THREE.Mesh {
  constructor(
    geometry = new THREE.BoxGeometry(1, 3, 1),
    material = new THREE.MeshBasicMaterial({ color: 0x0000ff })
  ) {
    super(geometry, material);
  }
}

export enum PlayerMeshOptions {
  Default,
}

export default { [PlayerMeshOptions.Default]: PlayerMesh };
