import * as THREE from "three";
import {
  UpdatePlayerDataDto,
  RemovePlayerDataDto,
  SetupSocketListenersDto,
  OtherPlayers,
} from "@types";
import { Player } from "@libs/player";
import { emit } from "./emit";
import io from "socket.io-client";

const handleUpdatePlayer = (
  playerData: UpdatePlayerDataDto,
  scene: THREE.Scene,
  otherPlayers: OtherPlayers
) => {
  if (!otherPlayers[playerData.id]) {
    const otherGeometry = new THREE.BoxGeometry(0.5, 1, 0.5);
    const otherMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const otherMesh = new THREE.Mesh(otherGeometry, otherMaterial);
    const player = new Player({ id: playerData.id, mesh: otherMesh });
    scene.add(otherMesh);
    otherPlayers[playerData.id] = player;
  }
  otherPlayers[playerData.id].updatePosition(
    playerData.x,
    playerData.y,
    playerData.z
  );
};

const handleRemovePlayer = (
  data: RemovePlayerDataDto,
  scene: THREE.Scene,
  otherPlayers: OtherPlayers
) => {
  if (otherPlayers[data.id]) {
    const { mesh: player } = otherPlayers[data.id];
    scene.remove(player);
    delete otherPlayers[data.id];
  }
};

export const setupSocketListeners = ({
  scene,
  otherPlayers,
  localPlayer,
}: SetupSocketListenersDto) => {
  const socket = io();
  socket.on("updatePlayer", (playerData: UpdatePlayerDataDto) =>
    handleUpdatePlayer(playerData, scene, otherPlayers)
  );
  socket.on("removePlayer", (data: { id: string }) =>
    handleRemovePlayer(data, scene, otherPlayers)
  );

  setInterval(() => {
    const pos = localPlayer.mesh.position;
    emit(socket, "updatePlayer", {
      id: localPlayer.id,
      x: pos.x,
      y: pos.y,
      z: pos.z,
    });
  }, 50);
};
