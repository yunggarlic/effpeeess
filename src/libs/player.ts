import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";
import { cameraSettings } from "../core/constants";
import { v4 as uuidv4 } from "uuid";
import { GameObject } from "@core/game-object";

interface PlayerProps {
  id: string;
  mesh: THREE.Mesh;
  isOtherPlayer?: boolean;
  geometry?: THREE.BoxGeometry;
  material?: THREE.MeshBasicMaterial;
}

export class Player extends GameObject {
  id: string;
  mesh: THREE.Mesh;
  isOtherPlayer: boolean = false;
  constructor({
    id,
    mesh,
    isOtherPlayer = false,
    geometry = new THREE.BoxGeometry(1, 2, 1),
    material = new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
  }: PlayerProps) {
    super({ geometry, material });
    this.id = id;
    this.mesh = mesh ?? new THREE.Mesh(geometry, material);
    this.isOtherPlayer = isOtherPlayer;

    this.mesh.position.y = 0.5;

    const gunGeometry = new THREE.BoxGeometry(0.3, 0.2, 1);
    const gunMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const gunMesh = new THREE.Mesh(gunGeometry, gunMaterial);
    gunMesh.position.set(0.4, -0.3, -1);
    if (isOtherPlayer) {
      this.mesh.add(gunMesh);
    }
  }

  updatePosition(x: number, y: number, z: number) {
    this.mesh.position.set(x, y, z);
  }
}

export class LocalPlayer extends Player {
  controls: PointerLockControls;
  camera: THREE.PerspectiveCamera;
  constructor({ id, mesh }: PlayerProps) {
    super({ id, mesh });
    this.camera = new THREE.PerspectiveCamera(...cameraSettings.getShit());
    this.camera?.position.set(0, 2, 5);
    this.controls = new PointerLockControls(this.camera, document.body);

    const gunGeometry = new THREE.BoxGeometry(0.3, 0.2, 1);
    const gunMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const gunMesh = new THREE.Mesh(gunGeometry, gunMaterial);
    gunMesh.position.set(0.4, -0.3, -1);

    this.controls.object.add(gunMesh);
  }
}

export const localPlayer = new LocalPlayer({
  id: uuidv4(),
  mesh: new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 1, 0.5),
    new THREE.MeshBasicMaterial({ color: 0x0000ff })
  ),
});
