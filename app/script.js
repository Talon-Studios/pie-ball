// Pie-Ball
/*^*^*^*^*^*^*^*
script.js
The main script for Pie-Ball.
*^*^*^*^*^*^*^*/

let game = {
  pieAngle: 0,
  pieSpeed: 1,
  pieDir: -1,
  holdDur: 0,
  playerFrozen: false,
  reload: 0
}
class GameScene extends Phaser.Scene {
  constructor() {
    super("game-scene");
  }
  preload() {
    this.engine = new Engine(this);

    // ********** Load assets **********
    // ---------- Load image assets ----------
    this.load.image("cursor", "assets/cursor.png");
    this.load.image("pie", "assets/pie.png");
    this.load.image("player", "assets/player.png");
    this.load.image("arrow", "assets/arrow.png");
  }
  create() {
    this.engine.pixelCursor();

    // Groups
    game.pies = this.physics.add.group();

    // Player
    game.player = this.physics.add.sprite(this.engine.gameWidthCenter, 3 * (this.engine.gameHeight / 4), "player").setScale(8).setDrag(500).setSize(5, 3).setOffset(0, 0).setCollideWorldBounds(true).setGravityY(-1500);
    game.playerFrozen = false;

    // Create arrow
    game.aimerArrow = this.add.image(game.player.x - 10, game.player.y - 20, "arrow").setScale(8);

    // Shooting
    this.input.on("pointerup", () => {
      if (game.reload >= 544) {
        let pie = game.pies.create(game.player.x, game.player.y, "pie").setScale(8).setSize(6, 4).setOffset(0, 0).setGravityY(-1500);
        this.physics.velocityFromAngle(game.pieAngle, game.holdDur * 1.5, pie.body.velocity);
        game.holdDur = 0;
        game.reload = 0;
      }
    });
  }
  update() {
    this.engine.updatePixelCursor();

    // ---------- Movement ----------
    if (!game.playerFrozen) {
      if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A).isDown) {
        game.player.setVelocityX(-300);
        game.pieDir = -1;
      }
      if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D).isDown) {
        game.player.setVelocityX(300);
        game.pieDir = 1;
      }
      if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S).isDown) {
        game.player.setVelocityY(300);
      }
      if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W).isDown) {
        game.player.setVelocityY(-300);
      }
    }
    if (this.engine.mouseDown && game.holdDur < 500 && game.reload >= 544) {
      game.holdDur += 5;
    }
    if (game.reload < 544) {
      game.reload += 5;
    }
    game.pieAngle += game.pieDir * game.pieSpeed;
    game.aimerArrow.x = game.player.x - 10;
    game.aimerArrow.y = game.player.y - 20;
    game.aimerArrow.angle = game.pieAngle + 140;
  }
}
