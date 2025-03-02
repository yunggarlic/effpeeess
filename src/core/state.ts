import * as THREE from "three";
import { Player } from "../libs/player";
import { GameConfiguration } from "@types";
import { ObjectManager } from "./object-manager";

export class GameState {
  public keysPressed: { [key: string]: boolean } = {};
  public scene: THREE.Scene = new THREE.Scene();
  public renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({
    antialias: true,
  });
  public otherPlayers: { [key: string]: Player } = {};
  public objectManager: ObjectManager = new ObjectManager();
  public configuration: GameConfiguration = new GameConfiguration();
  constructor() {
    this.keysPressed = {};
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
  }
}

export const gameState = new GameState();
