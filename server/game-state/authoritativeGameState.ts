// authoritativeGameState.ts
import * as THREE from "three";

// Define the state for a player that includes a last update timestamp.
export interface PlayerState {
  id: string;
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  materialId: number;
  geometryId: number;
  // You could also include inputs or timestamps to help with lag compensation.
  lastUpdateTime: number;
}

// Allowed tolerance for position differences (adjust based on your game scale).
const ALLOWED_POSITION_ERROR = 0.5;

export class AuthoritativeGameState {
  public players: { [id: string]: PlayerState } = {};

  constructor() {}

  public addPlayer(playerState: PlayerState) {
    this.players[playerState.id] = playerState;
  }

  public removePlayer(playerId: string) {
    delete this.players[playerId];
  }

  // A simple update method that uses deltaTime to move players.
  public update(deltaTime: number) {
    Object.values(this.players).forEach((player) => {
      const displacement = player.velocity.clone().multiplyScalar(deltaTime);
      player.position.add(displacement);
    });
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
    timestamp: number;
  }) {
    const serverPlayer = this.players[reportedState.id];
    if (!serverPlayer) return;

    // Compute deltaTime since the last update.
    const deltaTime = (reportedState.timestamp - serverPlayer.lastUpdateTime) / 1000; // seconds

    // Re-simulate the expected position.
    // This is a simplified simulation that doesn't include collision detection.
    const expectedPosition = serverPlayer.position.clone().add(
      serverPlayer.velocity.clone().multiplyScalar(deltaTime)
    );

    // Check if the reported position is within an acceptable error margin.
    const error = expectedPosition.distanceTo(reportedState.position);
    if (error > ALLOWED_POSITION_ERROR) {
      console.warn(
        `Player ${reportedState.id} moved too far! Expected: ${expectedPosition.toArray()}, reported: ${reportedState.position.toArray()}`
      );
      // Optionally, correct the position:
      reportedState.position.copy(expectedPosition);
    }

    // Update the player's state.
    serverPlayer.position.copy(reportedState.position);
    serverPlayer.velocity.copy(reportedState.velocity);
    serverPlayer.lastUpdateTime = reportedState.timestamp;
  }
}

// Create a singleton instance.
export const gameState = new AuthoritativeGameState();
