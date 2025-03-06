import { GameObject } from "@core/game-object";
import { GameObjectTypes } from "@types";

export class ObjectManager {
  collidables: number[];
  bullets: number[];
  uncategorized: number[];
  players: number[];
  all: Map<number, GameObject>;
  constructor() {
    this.collidables = [];
    this.bullets = [];
    this.uncategorized = [];
    this.players = [];
    this.all = new Map<number, GameObject>();
  }

  add(object: GameObject) {
    switch (object.type) {
      case GameObjectTypes.Player:
        this.players.push(object.mesh.id);
      case GameObjectTypes.Collidable:
        this.collidables.push(object.mesh.id);
        break;
      case GameObjectTypes.Bullet:
        this.bullets.push(object.mesh.id);
        break;
      default:
        this.uncategorized.push(object.mesh.id);
    }
    this.all.set(object.mesh.id, object);
  }
  addMany(objects: GameObject[]) {
    const { collidables, bullets, uncategorized, players } = objects.reduce(
      (acc, object) => {
        switch (object.type) {
          case GameObjectTypes.Player:
          case GameObjectTypes.Collidable:
            acc.collidables.push(object.mesh.id);
            break;
          case GameObjectTypes.Bullet:
            acc.bullets.push(object.mesh.id);
            break;
          case GameObjectTypes.Player:
            acc.players.push(object.mesh.id);
            break;
          default:
            acc.uncategorized.push(object.mesh.id);
            this.all.set(object.mesh.id, object);
        }
        return acc;
      },
      {
        players: [] as number[],
        collidables: [] as number[],
        bullets: [] as number[],
        uncategorized: [] as number[],
      }
    );

    this.collidables.push(...collidables);
    this.bullets.push(...bullets);
    this.uncategorized.push(...uncategorized);
    this.players.push(...players);
  }
  remove(object: GameObject) {
    switch (object.type) {
      case GameObjectTypes.Player:
        this.players = this.players.filter((id) => id !== object.mesh.id);
        this.collidables = this.collidables.filter(
          (id) => id !== object.mesh.id
        );
        break;
      case GameObjectTypes.Collidable:
        this.collidables = this.collidables.filter(
          (id) => id !== object.mesh.id
        );
        break;
      case GameObjectTypes.Bullet:
        this.bullets = this.bullets.filter((id) => id !== object.mesh.id);
        break;
      default:
        this.uncategorized = this.uncategorized.filter(
          (id) => id !== object.mesh.id
        );
    }
    this.all.delete(object.mesh.id);
    console.log('collidables -->', this.collidables);
    console.log(`Removed object ${object.mesh.id} - ${object.type}`);
  }
  removeMany(objects: GameObject[]) {
    objects.forEach((object) => this.remove(object));
  }
  getGameObjectById(id: number): GameObject | undefined {
    return this.all.get(id);
  }
}
