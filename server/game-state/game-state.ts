// authoritativeGameState.ts
import * as THREE from "three";
import { ObjectManager } from "./object-manager";
import { Player } from "server/game-objects/player";
import { GameConfiguration } from "./configuration";
import { Collidable } from "server/game-objects/collidable";
import { Bullet } from "server/game-objects/bullet";

// Define the state for a player that includes a last update timestamp.
export interface PlayerState {
  id: string;
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  rotation: THREE.Quaternion;
  materialId: number;
  geometryId: number;
  // You could also include inputs or timestamps to help with lag compensation.
  lastUpdateTime: number;
}

// Allowed tolerance for position differences (adjust based on your game scale).
const ALLOWED_POSITION_ERROR = 0.5;

export class AuthoritativeGameState {
  public objectManager: ObjectManager = new ObjectManager();
  public configuration: GameConfiguration = new GameConfiguration();
  constructor() {}

  public addPlayer(player: Player): string {
    this.objectManager.add(player);
    return player.id;
  }
  public removePlayer(playerId: string) {
    this.objectManager.remove(playerId);
  }
  public getPlayer(playerId: string): Player | null {
    return this.objectManager.get(playerId) as Player;
  }
  public getAllPlayers(): Player[] {
    return this.objectManager.players.map((id) => {
      return this.objectManager.get(id) as Player;
    });
  }
  public update(deltaTime: number) {
    this.updatePlayers(deltaTime);
    this.updateBullets(deltaTime);
  }
  private updatePlayers(deltaTime: number) {
    Object.values(this.getAllPlayers()).forEach((player) => {
      const displacement = player.velocity.clone().multiplyScalar(deltaTime);
      player.position.add(displacement);
    });
  }
  private updateBullets(deltaTime: number) {
    for (const bulletId of this.objectManager.bullets) {
      const bullet = this.objectManager.get(bulletId) as Bullet;
      bullet.update(deltaTime);

      for (const collidable of gameState.objectManager.collidables) {
        const collidableObject = gameState.objectManager.get(
          collidable
        ) as Collidable;
        bullet.checkCollision(collidableObject);
      }
    }
  }

  /**
   * Validates a movement update received from a client.
   * @param reportedState - The state received from the client.
   * @param currentTime - The current server time.
   */
  public validateAndUpdatePlayer(reportedState: {
    id: string;
    position: THREE.Vector3;
    velocity: THREE.Vector3;
    rotation: THREE.Quaternion;
    timestamp: number;
  }) {
    const serverPlayer = this.getPlayer(reportedState.id);
    if (!serverPlayer) throw new Error("Player not found");

    // Update the player's state.
    serverPlayer.position.copy(reportedState.position);
    serverPlayer.velocity.copy(reportedState.velocity);
    serverPlayer.rotation.copy(reportedState.rotation);
    serverPlayer.lastUpdateTime = reportedState.timestamp;
  }

  
}

// Create a singleton instance.
export const gameState = new AuthoritativeGameState();
