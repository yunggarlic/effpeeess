import * as THREE from "three";
import { Player } from "../libs/player";

export class GameState {
  public keysPressed: { [key: string]: boolean };
  public scene: THREE.Scene;
  public renderer: THREE.WebGLRenderer;
  public otherPlayers: { [key: string]: Player } = {};
  constructor() {
    this.keysPressed = {};
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.otherPlayers = {};

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
  }
}

export const gameState = new GameState();
