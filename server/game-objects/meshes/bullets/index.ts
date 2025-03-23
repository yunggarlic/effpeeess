import * as THREE from "three";

export enum BulletMeshOptions {
  Default,
}

export class BulletMesh extends THREE.Mesh {
  constructor(
    geometry = new THREE.SphereGeometry(0.05, 16, 16),
    material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
  ) {
    super(geometry, material);
  }
}

export default { [BulletMeshOptions.Default]: BulletMesh };
