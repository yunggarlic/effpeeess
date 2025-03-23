import { SocketListenerMessages } from "..";
import {
  BulletCreateDataDto,
  BulletHitDataDto,
  CreatePlayerDataDto,
  InitializePlayerDataDto,
  RemovePlayerDataDto,
  UpdatePlayerDataDto,
} from ".";

// ** Maps messages to their respective data types **
export interface SocketEvents {
  emit: {
    [K in keyof SocketEmitEventMap]: (data: SocketEmitEventMap[K]) => void;
  };
  on: {
    [K in keyof SocketListenerEventMap]: (
      data: SocketListenerEventMap[K]
    ) => void;
  };
}

export interface SocketEmitEventMap {
  [SocketListenerMessages.Initialize]: void;
  [SocketListenerMessages.UpdatePlayer]: UpdatePlayerDataDto;
  [SocketListenerMessages.RemovePlayer]: RemovePlayerDataDto;
  [SocketListenerMessages.CreatePlayer]: CreatePlayerDataDto;
  [SocketListenerMessages.BulletHit]: BulletHitDataDto;
  [SocketListenerMessages.BulletCreate]: BulletCreateDataDto;
  [SocketListenerMessages.InitializePlayer]: InitializePlayerDataDto;
}

export interface SocketListenerEventMap {
  [SocketListenerMessages.Initialize]: void;
  [SocketListenerMessages.UpdatePlayer]: UpdatePlayerDataDto;
  [SocketListenerMessages.RemovePlayer]: RemovePlayerDataDto;
  [SocketListenerMessages.CreatePlayer]: CreatePlayerDataDto;
  [SocketListenerMessages.BulletCreate]: BulletCreateDataDto;
  [SocketListenerMessages.BulletHit]: BulletHitDataDto;
  [SocketListenerMessages.InitializePlayer]: InitializePlayerDataDto;
  [SocketListenerMessages.Disconnect]: void;
}
