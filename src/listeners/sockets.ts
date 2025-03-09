import * as THREE from "three";
import {
  UpdatePlayerDataDto,
  RemovePlayerDataDto,
  SetupSocketListenersDto,
  OtherPlayers,
} from "@types";
import { SocketListenerMessages } from "@shared"
import { emit } from "./emit";
import { Player } from "@libs/player";
import { io } from "socket.io-client";
import { gameState } from "@core/state";

const handleUpdatePlayer = (
  playerData: UpdatePlayerDataDto,
  scene: THREE.Scene,
  otherPlayers: OtherPlayers
) => {
  console.log('handling update player', playerData)
  if (!otherPlayers[playerData.id]) {
    const otherGeometry = new THREE.BoxGeometry(0.5, 1, 0.5);
    const otherMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const otherMesh = new THREE.Mesh(otherGeometry, otherMaterial);
    const player = new Player({ id: playerData.id, mesh: otherMesh });
    scene.add(otherMesh);
    otherPlayers[playerData.id] = player;
  }

  const { position: [x, y, z] } = playerData
  otherPlayers[playerData.id].updatePosition(x, y, z);
};

const handleRemovePlayer = (
  data: RemovePlayerDataDto,
  scene: THREE.Scene,
  otherPlayers: OtherPlayers
) => {
  // if (otherPlayers[data.id]) {
  //   const { mesh: player } = otherPlayers[data.id];
  //   scene.remove(player);
  //   delete otherPlayers[data.id];
  // }
};

const handleInitialize = (data: { multiplayerId: string, players: UpdatePlayerDataDto[] }) => {
  for (const playerId in data.players) {
    if (gameState.localPlayer!.id !== playerId) {
      const player = data.players[playerId];
      const newPlayer = new Player({ id: player.id });
      newPlayer.addToScene();
    }
  }
}

export const setupSocketListeners = ({
  scene,
  otherPlayers,
  localPlayer,
}: SetupSocketListenersDto) => {
  const socket = io();
  socket.on(SocketListenerMessages.UpdatePlayer, (playerData: UpdatePlayerDataDto) =>
    handleUpdatePlayer(playerData, scene, otherPlayers)
  );
  socket.on(SocketListenerMessages.RemovePlayer, (data: { id: string }) =>
    handleRemovePlayer(data, scene, otherPlayers)
  );
  socket.on(SocketListenerMessages.CreatePlayer, (data: { id: string }) => {
    console.log('incoming player', data)
  });
  socket.on(SocketListenerMessages.Initialize, handleInitialize);
  socket.on(SocketListenerMessages.StateUpdate, (data: { players: UpdatePlayerDataDto[] }) => {
    console.log('state update', data)
  });

  console.log('emitting initialize')
  socket.emit(SocketListenerMessages.Initialize)

  setInterval(() => {
    const pos = localPlayer.mesh.position;
    const velocity = localPlayer.horizontalVelocity;

    const updateDto = {
      id: localPlayer.id,
      position: [pos.x, pos.y, pos.z],
      velocity: [velocity.x, velocity.y, velocity.z],
      lastUpdateTime: Date.now(),
    }

    emit(socket, SocketListenerMessages.UpdatePlayer, updateDto);
  }, 50);

};
