class CameraSettings {
  fov: number;
  aspect: number;
  near: number;
  far: number;
  constructor() {
    this.fov = 75;
    this.aspect = window.innerWidth / window.innerHeight;
    this.near = 0.1;
    this.far = 1000;
  }

  getShit() {
    return [this.fov, this.aspect, this.near, this.far];
  }
}

export const cameraSettings = new CameraSettings();
export const MOVE_SPEED = 0.1;

