const GameConfigDefault = {
  bulletSpeed: 20,
  bulletMaxDistance: 50,
  moveSpeed: 10,
  jumpForce: 10,
  gravity: 30,
};

export class GameConfiguration {
  bulletSpeed: number;
  bulletMaxDistance: number;
  moveSpeed: number;
  jumpForce: number;
  gravity: number;
  constructor(config: GameConfiguration = GameConfigDefault) {
    this.bulletSpeed = config.bulletSpeed ?? GameConfigDefault.bulletSpeed;
    this.bulletMaxDistance =
      config.bulletMaxDistance ?? GameConfigDefault.bulletMaxDistance;
    this.moveSpeed = config.moveSpeed ?? GameConfigDefault.moveSpeed;
    this.jumpForce =
      config.bulletMaxDistance ?? GameConfigDefault.bulletMaxDistance;
    this.gravity = config.gravity ?? GameConfigDefault.gravity;
  }
}
