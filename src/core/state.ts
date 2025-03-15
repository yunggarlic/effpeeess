import * as THREE from "three";
import { LocalPlayer, Player } from "../libs/player";
import { GameConfiguration } from "@types";
import { ObjectManager } from "./object-manager";

export class GameState {
  public keysPressed: { [key: string]: boolean } = {};
  public scene: THREE.Scene = new THREE.Scene();
  public renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({
    antialias: true,
  });
  public localPlayer: LocalPlayer | null = null;
  public otherPlayers: { [key: string]: Player } = {};
  public objectManager: ObjectManager = new ObjectManager();
  public configuration: GameConfiguration = new GameConfiguration();
  public clock: THREE.Clock = new THREE.Clock();
  constructor() {
    this.keysPressed = {};
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
  }

  setLocalPlayer(localPlayer: LocalPlayer) {
    this.localPlayer = localPlayer;
  }

  addPlayerToLobby(player: Player) {
    if (player.multiplayerId) {
      this.otherPlayers[player.multiplayerId] = player;
    } else {
      console.error("player does not have a multiplayerId");
    }
  }

  getPlayerInLobby(multiplayerId: string) {
    return this.otherPlayers[multiplayerId];
  }

  removePlayerFromLobby(multiplayerId: string) {
    delete this.otherPlayers[multiplayerId];
  }
}

export const gameState = new GameState();
