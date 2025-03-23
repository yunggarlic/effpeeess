import { ObjectManagerAcceptableTypes } from "server/game-state/object-manager";
import { GameObject } from "./game-object";

export class Collidable extends GameObject {
  public isCollidable: boolean = true;
  constructor() {
    super({ type: ObjectManagerAcceptableTypes.Collidable });
  }

  hit() {
    console.log("hit on collidable not implemented");
  }
}
