import { randomUUID } from "crypto";
import { ObjectManagerAcceptableTypes } from "server/game-state/object-manager";

export type GameObjectConstructor = {
  type: ObjectManagerAcceptableTypes;
};

export class GameObject {
  id: string;
  type: ObjectManagerAcceptableTypes;

  constructor({ type }: GameObjectConstructor) {
    this.id = randomUUID();
    this.type = type;
  }

  update(delta: number) {
    console.error("GameObject update method not implemented");
  }
}
