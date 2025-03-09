import * as THREE from 'three';
import { Socket } from 'socket.io';
import { gameState } from '../../game-state/authoritativeGameState';

export const handleUpdatePlayer = (socket: Socket, data: { position: number[]; velocity: number[]; timestamp: number }) => {
  // Convert the received array data into THREE.Vector3 objects.
  // console.log('received update player', data);
  const pos = new THREE.Vector3(...data.position);
  const vel = new THREE.Vector3(...data.velocity);
  const reportedState = {
    id: socket.id,
    position: pos,
    velocity: vel,
    timestamp: data.timestamp,
  };

  // Validate the reported state and update the authoritative game state.
  gameState.validateAndUpdatePlayer(reportedState);
}