import * as THREE from "three";
import { Player } from "../libs/player";
import { GameConfiguration, } from "@types"
import { ObjectManager } from "./object-manager";


const defaultObjectManager = new ObjectManager();

export class GameState {
  public keysPressed: { [key: string]: boolean } = {};
  public scene: THREE.Scene = new THREE.Scene();
  public renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({ antialias: true });
  public otherPlayers: { [key: string]: Player } = {};
  public objectManager: ObjectManager = defaultObjectManager;
  public configuration: GameConfiguration = { bulletSpeed: 20, bulletMaxDistance: 50, moveSpeed: 10 };
  constructor() {
    this.keysPressed = {};
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
  }
}



export const gameState = new GameState();
