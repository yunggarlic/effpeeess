import { GameObject } from "../game-objects/game-object";

export class ObjectManager {
  collidables: string[];
  bullets: string[];
  players: string[];
  all: Map<string, GameObject>;
  constructor() {
    this.collidables = [];
    this.bullets = [];
    this.players = [];
    this.all = new Map<string, GameObject>();
  }

  add(object: GameObject) {
    switch (object.type) {
      case ObjectManagerAcceptableTypes.Collidable:
        this.collidables.push(object.id);
        break;
      case ObjectManagerAcceptableTypes.Bullet:
        this.bullets.push(object.id);
        break;
      case ObjectManagerAcceptableTypes.Player:
        this.players.push(object.id);
        break;
      default:
        throw new Error("Invalid object type");
    }
    this.all.set(object.id, object);
  }
  remove(objectId: string) {
    const object = this.all.get(objectId);
    if (object) {
      this.all.delete(objectId);
    } else {
      throw new Error("Object not found");
    }
    switch (object.type) {
      case ObjectManagerAcceptableTypes.Collidable:
        this.collidables = this.collidables.filter((id) => id !== objectId);
        break;
      case ObjectManagerAcceptableTypes.Bullet:
        this.bullets = this.bullets.filter((id) => id !== objectId);
        break;
      case ObjectManagerAcceptableTypes.Player:
        this.players = this.players.filter((id) => id !== objectId);
        break;
      default:
        throw new Error("Invalid object type");
    }
  }
  get(id: string): GameObject | null {
    const item = this.all.get(id);
    if (item) {
      return item;
    } else {
      return null;
    }
  }
}

export enum ObjectManagerAcceptableTypes {
  Collidable = "collidable",
  Bullet = "bullet",
  Player = "player",
}
