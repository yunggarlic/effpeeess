import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";
import { cameraSettings } from "../core/constants";
import { v4 as uuidv4 } from "uuid";
import { Collidable } from "@core/game-object";
import { gameState } from "@core/state";
import { Bullet, getBulletProps } from "./bullets";
import { GameObjectTypes } from "@types";

interface PlayerProps {
  id: string;
  mesh: THREE.Mesh;
  isOtherPlayer?: boolean;
  geometry?: THREE.BoxGeometry;
  material?: THREE.MeshBasicMaterial;
  gunMeshId?: string;
}

export class Player extends Collidable {
  id: string;
  mesh: THREE.Mesh;
  isOtherPlayer: boolean = false;
  gunMeshId: number;
  constructor({
    id,
    mesh,
    isOtherPlayer = false,
    geometry = new THREE.BoxGeometry(1, 2, 1),
    material = new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
  }: PlayerProps) {
    super({ geometry, material, type: GameObjectTypes.Player });
    this.id = id;
    this.mesh = mesh ?? new THREE.Mesh(geometry, material);
    this.isOtherPlayer = isOtherPlayer;
    this.gunMeshId = -1;
    this.type = GameObjectTypes.Player;

    this.mesh.position.y = 0.5;
    this.addGunMesh();
  }

  setGunMeshId(gunMeshId: number) {
    this.gunMeshId = gunMeshId;
  }

  addGunMesh(): THREE.Mesh | void {
    const gunGeometry = new THREE.BoxGeometry(0.3, 0.2, 1);
    const gunMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const gunMesh = new THREE.Mesh(gunGeometry, gunMaterial);
    gunMesh.position.set(0.4, -0.3, -1);
    this.setGunMeshId(gunMesh.id);

    this.mesh.add(gunMesh);
    return gunMesh
  }

  updatePosition(x: number, y: number, z: number): THREE.Vector3 {
    return this.mesh.position.set(x, y, z);
  }

  getWorldDirection(): THREE.Vector3 {
    return this.mesh.getWorldDirection(new THREE.Vector3());
  }

  shoot(): Bullet | undefined {
    const gunMesh = this.getGunMesh();

    if (!gunMesh) {
      console.error("Gun mesh not found");
      return;
    }

    // Determine the forward direction from the player's world position;
    return new Bullet(
      getBulletProps(),
      this.getWorldDirection().multiplyScalar(gameState.configuration.bulletSpeed),
      gunMesh.getWorldPosition(new THREE.Vector3())
    )
  }

  getGunMesh() {
    return this.mesh.getObjectById(this.gunMeshId);
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
    this.addGunMesh()
    this.setupListeners()
  }

  addGunMesh(): THREE.Mesh | void {
    if (this.controls) {
      const gunGeometry = new THREE.BoxGeometry(0.3, 0.2, 1);
      const gunMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
      const gunMesh = new THREE.Mesh(gunGeometry, gunMaterial);
      gunMesh.position.set(0.4, -0.3, -1);
      this.setGunMeshId(gunMesh.id);
      this.controls.object.add(gunMesh);
      return gunMesh
    }
  }

  setGunMeshId(id: number) {
    this.gunMeshId = id;
  }

  getGunMesh() {
    console.log(this.controls.object.getObjectById(this.gunMeshId))
    return this.controls.object.getObjectById(this.gunMeshId);
  }
  getWorldDirection() {
    return this.camera.getWorldDirection(new THREE.Vector3());
  }

  setupListeners() {
    document.addEventListener("mousedown", (event: MouseEvent) => {
      if (event.button === 0) {
        this.shoot();
      }
    });
  }
}

export const localPlayer = new LocalPlayer({
  id: uuidv4(),
  mesh: new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 1, 0.5),
    new THREE.MeshBasicMaterial({ color: 0x0000ff })
  ),
});
