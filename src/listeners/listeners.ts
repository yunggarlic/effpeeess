import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";
import { handleKeyDown, handleKeyUp, handleWindowResize } from "./handlers";

interface AddListenerProps {
  renderer: THREE.WebGLRenderer;
  camera: THREE.PerspectiveCamera;
  keysPressed: Record<string, boolean>;
  controls: PointerLockControls;
}

const addWindowResizeListener = (
  renderer: THREE.WebGLRenderer,
  camera: THREE.PerspectiveCamera
) => {
  window.addEventListener("resize", () => handleWindowResize(renderer, camera));
};

const addClickControlLockListener = (controls: PointerLockControls) => {
  document.body.addEventListener(
    "click",
    () => {
      controls.lock();
    },
    false
  );
};

const addKeyListeners = (keysPressed: Record<string, boolean>) => {
  const keyDownCallback = (event: KeyboardEvent) =>
    handleKeyDown(event, keysPressed);

  const keyUpCallback = (event: KeyboardEvent) =>
    handleKeyUp(event, keysPressed);

  document.addEventListener("keydown", keyDownCallback);
  document.addEventListener("keyup", keyUpCallback);
};

export const addListeners = ({
  renderer,
  camera,
  keysPressed,
  controls,
}: AddListenerProps) => {
  addWindowResizeListener(renderer, camera);
  addKeyListeners(keysPressed);
  addClickControlLockListener(controls);
};
