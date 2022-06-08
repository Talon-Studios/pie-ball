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

class Pie {
  constructor(_this, type) {
    let pie = game.pies.create(game.player.x, game.player.y, "pie");
    pie.setScale(8);
    pie.setSize(6, 4);
    pie.setOffset(0, 0);
    pie.setGravityY(-1500);
    pie.setDepth(1);
    pie.type = type;
    _this.physics.velocityFromAngle(game.player.pieAngle, game.player.holdDur * 1.5, pie.body.velocity);
  }
}

// Main phaser game scene
class GameScene extends Phaser.Scene {
  constructor() { super("game-scene"); }
  isKeyDown(key) { return this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[key]).isDown; }
  createPlayer() {
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
    game.player.maxReload = 600;
    game.player.selectedPie = "basic";
  }
  createPieSelector(selectorSize, selectorPadding, border, barWidth, reloadPadding) {
    game.pieSelectorGraphics = this.add.graphics().setDepth(3);
    game.pieSelector = this.add.rectangle(selectorPadding * 3, selectorPadding * 3, selectorSize, selectorSize);
    game.pieSelector.setInteractive();
    game.pieSelectorGraphics.lineStyle(border, game.themeColors.notblack);
    game.pieSelectorGraphics.strokeRect(selectorPadding, selectorPadding, selectorSize, selectorSize);
    game.pieSelectorImage = this.add.image(selectorPadding + 32 + 16, selectorPadding + 64, "pie").setScale(8).setDepth(3);
    game.pieSelector.on("pointerdown", () => { game.selectedPie = "custard"; });
    game.pieReload = this.add.rectangle(selectorPadding + (selectorSize - barWidth - 0.5) / 2, selectorPadding + reloadPadding + 5, 0, 10, game.themeColors.secondary1).setDepth(3);
    game.pieReload.maxWidth = barWidth;
    game.pieReloadBar = this.add.graphics().setDepth(3);
    game.pieReloadBar.lineStyle(border, game.themeColors.notblack);
    game.pieReloadBar.strokeRect(selectorPadding + (selectorSize - barWidth - 0.5) / 2, selectorPadding + reloadPadding, barWidth, 10);
  }
  createEnergyBar(border, barWidth) {
    // Energy bar
    game.player.energyBarGraphics = this.add.graphics().setDepth(2);
    game.player.energyBarGraphics.lineStyle(border, game.themeColors.notblack);
    game.player.energyBarGraphics.strokeRect(game.player.x - barWidth / 2 - 10, game.player.y + 25, barWidth, 10);
  }
  createPie(type) {
    new Pie(this, "custard");
    game.player.holdDur = 0;
    game.player.reload = 0;
    game.pieReload.width = 0;
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

    // Constants for bar and selector properties
    const SELECTORSIZE = 80;
    const SELECTORPADDING = 20;
    const BORDER = 3;
    const BARWIDTH = 65;
    const RELOADPADDING = 10;

    // Groups
    game.pies = this.physics.add.group();

    // Create player
    this.createPlayer();

    // Create UI
    this.createPieSelector(SELECTORSIZE, SELECTORPADDING, BORDER, BARWIDTH, RELOADPADDING);
    this.createEnergyBar(BORDER, BARWIDTH);

    // Create arrow
    game.aimerArrow = this.add.image(game.player.x - 10, game.player.y - 20, "arrow").setScale(8);

    // Throwing pies
    this.input.on("pointerup", () => {
      if (game.player.reload >= game.player.maxReload) { this.createPie(); }
    });
  }
  update() {
    this.engine.updatePixelCursor();

    // Movement with WASD during game
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

    // Gain energy when holding mouse and reload is maxed out
    if (this.engine.mouseDown && game.player.holdDur < 500 && game.player.reload >= game.player.maxReload) { game.player.holdDur += 5; }

    // Extend the reload bar
    if (game.player.reload < game.player.maxReload) {
      game.player.reload += 5;
      game.pieReload.width += 320 / game.player.maxReload;
    }

    // Update positions and angles
    game.player.pieAngle += game.player.pieDir * game.player.pieSpeed;
    game.aimerArrow.x = game.player.x - 10;
    game.aimerArrow.y = game.player.y - 20;
    game.aimerArrow.angle = game.player.pieAngle + 140;
    game.player.energyBarGraphics.x = game.player.x - 640;
    game.player.energyBarGraphics.y = game.player.y - 450;
  }
}
