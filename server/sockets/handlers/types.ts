import { UpdatePlayerDataDto } from "@types";
import { SocketListenerMessages } from "@shared";

export interface InitializeDataDto {
  players: UpdatePlayerDataDto[];
  multiplayerId: string;
}


