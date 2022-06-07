// Pie-Ball
/*^*^*^*^*^*^*^*
script.js
The main script for Pie-Ball.
*^*^*^*^*^*^*^*/

// Game object for everything
let game = {
  themeColors: {
    primary1: 0xf40932,
    primary2: 0xc10c4c,
    secondary1: 0xd71871,
    secondary2: 0x54d8cd,
    notblack: 0x350941
  }
}

// Main game
class GameScene extends Phaser.Scene {
  constructor() {
    super("game-scene");
  }
  isKeyDown(key) {
    return this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[key]).isDown;
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

    // Player: Place at 1/4 of the screen
    game.player = this.physics.add.sprite(this.engine.gameWidthCenter, 3 * (this.engine.gameHeight / 4), "player");
    game.player.setScale(8);
    game.player.setDrag(500);
    game.player.setSize(5, 3);
    game.player.setOffset(0, 0);
    game.player.setCollideWorldBounds(true);
    game.player.setGravityY(-1500);
    game.player.setDepth(2);
    game.player.frozen = false;
    game.player.pieAngle = 0;
    game.player.pieSpeed = 1;
    game.player.pieDir = -1;
    game.player.holdDur = 0;
    game.player.reload = 0;
    game.player.selectedPie = "basic";


    // Create arrow
    game.aimerArrow = this.add.image(game.player.x - 10, game.player.y - 20, "arrow").setScale(8);

    // Create pie selectors
    const SELECTORSIZE = 80;
    const SELECTORPADDING = 20;
    const BORDER = 3;
    const RELOADWIDTH = 65;
    const RELOADPADDING = 10;
    game.pieSelectorGraphics = this.add.graphics().setDepth(3);
    game.pieSelector = this.add.rectangle(SELECTORPADDING * 3, SELECTORPADDING * 3, SELECTORSIZE, SELECTORSIZE);
    game.pieSelector.setInteractive();
    game.pieSelectorGraphics.lineStyle(BORDER, game.themeColors.notblack);
    game.pieSelectorGraphics.strokeRect(SELECTORPADDING, SELECTORPADDING, SELECTORSIZE, SELECTORSIZE);
    game.pieSelectorImage = this.add.image(SELECTORPADDING + 32 + 16, SELECTORPADDING + 64, "pie").setScale(8).setDepth(3);
    game.pieSelector.on("pointerdown", () => {
      game.selectedPie = "normal";
    });
    game.pieReload = this.add.rectangle(SELECTORPADDING + (SELECTORSIZE - RELOADWIDTH - 0.5) / 2, SELECTORPADDING + RELOADPADDING + 5, 0, 10, game.themeColors.secondary1).setDepth(3);
    game.pieReload.maxWidth = RELOADWIDTH;
    game.pieReloadBar = this.add.graphics().setDepth(3);
    game.pieReloadBar.lineStyle(BORDER, game.themeColors.notblack);
    game.pieReloadBar.strokeRect(SELECTORPADDING + (SELECTORSIZE - RELOADWIDTH - 0.5) / 2, SELECTORPADDING + RELOADPADDING, RELOADWIDTH, 10);

    // Shooting
    this.input.on("pointerup", () => {
      if (game.player.reload >= 544) {
        let pie = game.pies.create(game.player.x, game.player.y, "pie");
        pie.setScale(8);
        pie.setSize(6, 4);
        pie.setOffset(0, 0);
        pie.setGravityY(-1500);
        pie.setDepth(1);
        this.physics.velocityFromAngle(game.player.pieAngle, game.player.holdDur * 1.5, pie.body.velocity);
        game.player.holdDur = 0;
        game.player.reload = 0;
        game.pieReload.width = 0;
      }
    });
  }
  update() {
    this.engine.updatePixelCursor();

    // ---------- Movement ----------
    if (!game.player.frozen) {
      if (this.isKeyDown("A")) {
        game.player.setVelocityX(-300);
        game.player.pieDir = -1;
      }
      if (this.isKeyDown("D")) {
        game.player.setVelocityX(300);
        game.player.pieDir = 1;
      }
      if (this.isKeyDown("S")) {
        game.player.setVelocityY(300);
      }
      if (this.isKeyDown("W")) {
        game.player.setVelocityY(-300);
      }
    }
    if (this.engine.mouseDown && game.player.holdDur < 500 && game.player.reload >= 544) {
      game.player.holdDur += 5;
    }
    if (game.player.reload < 544) {
      game.player.reload += 5;
      game.pieReload.width += 0.6;
    }
    game.player.pieAngle += game.player.pieDir * game.player.pieSpeed;
    game.aimerArrow.x = game.player.x - 10;
    game.aimerArrow.y = game.player.y - 20;
    game.aimerArrow.angle = game.player.pieAngle + 140;
  }
}
