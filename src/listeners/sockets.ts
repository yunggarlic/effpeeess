import * as THREE from "three";
import {
  UpdatePlayerDataDto,
  RemovePlayerDataDto,
  SetupSocketListenersDto,
  OtherPlayers,
} from "@types";
import { SocketListenerMessages } from "@shared";
import { emit } from "./emit";
import { Player } from "@libs/player";
import { io } from "socket.io-client";
import { gameState } from "@core/state";

const handleUpdatePlayer = (playerData: UpdatePlayerDataDto) => {
  if (playerData.id === gameState.localPlayer?.id) return;
  const [x, y, z] = playerData.position;
  const player = gameState.getPlayerInLobby(playerData.id);
  if (!player) {
    console.error(`Player not found in lobby`);
    console.log(playerData);
    console.log(gameState);
    return;
  }
  player.updatePosition(x, y, z);
};

const handleRemovePlayer = (data: RemovePlayerDataDto) => {
  // if (otherPlayers[data.id]) {
  //   const { mesh: player } = otherPlayers[data.id];
  //   scene.remove(player);
  //   delete otherPlayers[data.id];
  // }
};

const handleCreatePlayer = (data: { id: string }) => {
  // console.log("incoming player", data);
  const newPlayer = new Player({
    id: data.id,
    multiplayerId: data.id,
  });
  gameState.addPlayerToLobby(newPlayer);
  newPlayer.addToScene();
};

const handleInitialize = (data: {
  players: UpdatePlayerDataDto[];
  multiplayerId: string;
}) => {
  gameState.localPlayer?.setMultiplayerId(data.multiplayerId);
  for (const playerId in data.players) {
    if (data.multiplayerId !== playerId) {
      const player = data.players[playerId];
      const newPlayer = new Player({
        id: player.id,
        multiplayerId: player.id,
      });
      gameState.addPlayerToLobby(newPlayer);
      newPlayer.addToScene();
    }
  }
};

export const setupSocketListeners = ({}: SetupSocketListenersDto) => {
  const socket = io();
  socket.on(SocketListenerMessages.UpdatePlayer, handleUpdatePlayer);
  socket.on(SocketListenerMessages.RemovePlayer, handleRemovePlayer);
  socket.on(SocketListenerMessages.Initialize, handleInitialize);
  socket.on(SocketListenerMessages.CreatePlayer, handleCreatePlayer);
  // socket.on(SocketListenerMessages.StateUpdate, () => {});

  console.log("emitting initialize");
  socket.emit(SocketListenerMessages.Initialize);

  setInterval(() => {
    if (!gameState.localPlayer) return;

    const pos = gameState.localPlayer.controls.object.getWorldPosition(
      new THREE.Vector3()
    );
    const velocity = gameState.localPlayer.horizontalVelocity;

    const updateDto = {
      id: gameState.localPlayer.id,
      position: [pos.x, pos.y, pos.z],
      velocity: [velocity.x, velocity.y, velocity.z],
      timestamp: Date.now(),
    };

    // console.log(updateDto);

    emit(socket, SocketListenerMessages.UpdatePlayer, updateDto);
  }, 50);
};
