import * as THREE from "three";
import {
  UpdatePlayerDataDto,
  RemovePlayerDataDto,
  SetupSocketListenersDto,
} from "@types";
import { SocketListenerMessages } from "@shared";
import { emit } from "./emit";
import { Player } from "@libs/player";
import { io } from "socket.io-client";
import { gameState } from "@core/state";

const handleUpdatePlayer = (playerData: UpdatePlayerDataDto) => {
  if (playerData.id === gameState.localPlayer?.id) return;
  const [x, y, z] = playerData.position;
  console.log("player.rotation", playerData.rotation);
  const [qx, qy, qz, qw] = playerData.rotation;
  const player = gameState.getPlayerInLobby(playerData.id);
  if (!player) {
    console.error(`Player not found in lobby`);
    console.log(playerData);
    console.log(gameState);
    return;
  }
  player.updatePosition(x, y, z);
  player.updateRotation(qx, qy, qz, qw);
};

const handleRemovePlayer = (data: RemovePlayerDataDto) => {
  console.log("removing player", data);
  if (gameState.otherPlayers[data.id]) {
    gameState.otherPlayers[data.id].destroy();
    gameState.removePlayerFromLobby(data.id);
  }
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

    const vec = new THREE.Vector3();
    const position = gameState.localPlayer.controls.object
      .getWorldPosition(vec)
      .toArray();
    const velocity = gameState.localPlayer.horizontalVelocity.toArray();
    const rotation = gameState.localPlayer.controls.object.quaternion.toArray();

    const updateDto = {
      id: gameState.localPlayer.id,
      position,
      velocity,
      rotation,
      timestamp: Date.now(),
    };

    // console.log(updateDto);

    emit(socket, SocketListenerMessages.UpdatePlayer, updateDto);
  }, 50);
};
