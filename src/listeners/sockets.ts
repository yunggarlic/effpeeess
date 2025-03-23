import * as THREE from "three";
import {
  UpdatePlayerDataDto,
  RemovePlayerDataDto,
  SetupSocketListenersDto,
  CreatePlayerDataDto,
  InitializeDataDto,
  BulletCreateDataDto,
} from "@types";
import { SocketListenerMessages } from "@shared";
import { emit } from "./emit";
import { Player } from "@libs/player";
import { Socket, io } from "socket.io-client";
import { gameState } from "@core/state";
import { SocketEvents } from "shared/sockets/SocketEventMap";
import { InitializePlayerDataDto } from "shared/sockets";

export const socket: Socket<SocketEvents["on"], SocketEvents["emit"]> = io();

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

const handleCreatePlayer = (data: CreatePlayerDataDto) => {
  // console.log("incoming player", data);
  const newPlayer = new Player({
    id: data.id,
    multiplayerId: data.id,
  });
  gameState.addPlayerToLobby(newPlayer);
  newPlayer.addToScene();
};

const handleInitializePlayer = ({
  newPlayer,
  players,
}: InitializePlayerDataDto) => {
  gameState.localPlayer?.setMultiplayerId(newPlayer.multiplayerId);
  for (const playerId in players) {
    if (newPlayer.multiplayerId !== playerId) {
      const player = players[playerId];
      const newPlayer = new Player({
        id: player.id,
        multiplayerId: player.id,
      });
      gameState.addPlayerToLobby(newPlayer);
      newPlayer.addToScene();
    }
  }
};

const handleBulletCreate = (data: BulletCreateDataDto) => {
  const player = gameState.getPlayerInLobby(data.id);
  if (player) {
    player.shoot();
  }
};
const handleBulletHit = (data: BulletCreateDataDto) => {};

export const setupSocketListeners = ({}: SetupSocketListenersDto) => {
  socket.on(SocketListenerMessages.InitializePlayer, handleInitializePlayer);
  socket.on(SocketListenerMessages.CreatePlayer, handleCreatePlayer);
  socket.on(SocketListenerMessages.UpdatePlayer, handleUpdatePlayer);
  socket.on(SocketListenerMessages.RemovePlayer, handleRemovePlayer);
  // socket.on(SocketListenerMessages.BulletCreate, handleBulletCreate);
  // socket.on(SocketListenerMessages.BulletHit, handleBulletHit);

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
