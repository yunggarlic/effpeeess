import * as THREE from "three";

const handleKeyDown = (
  event: KeyboardEvent,
  keysPressed: Record<string, boolean>
) => (keysPressed[event.key.toLowerCase()] = true);

const handleKeyUp = (
  event: KeyboardEvent,
  keysPressed: Record<string, boolean>
) => (keysPressed[event.key.toLowerCase()] = false);

const handleWindowResize = (
  renderer: THREE.WebGLRenderer,
  camera: THREE.PerspectiveCamera
) => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
};

export { handleKeyDown, handleKeyUp, handleWindowResize };
