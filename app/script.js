// Pie-Ball
/*^*^*^*^*^*^*^*
script.js
The main script for Pie-Ball.
*^*^*^*^*^*^*^*/

import {Pie} from "./Pie.js";
import {Opponent} from "./Opponent.js";

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
// Main phaser game scene
export class GameScene extends Phaser.Scene {
  constructor() { super("game-scene"); }
  spritesInGroup(group, callback) { group.getChildren().forEach(callback); }
  createPlayer() {
    // Player: Place at 1/4 of the screen
    this.player = this.physics.add.sprite(this.engine.gameWidthCenter, 3 * (this.engine.gameHeight / 4), "player");
    this.player.setScale(8);
    this.player.setDrag(500);
    this.player.setSize(5, 3);
    this.player.setOffset(0, 0);
    this.player.setCollideWorldBounds(true);
    this.player.setGravityY(-1500);
    this.player.setDepth(2);
    this.player.frozen = false;
    this.player.pieAngle = 0;
    this.player.pieSpeed = 1;
    this.player.pieDir = -1;
    this.player.holdDur = 0;
    this.player.reload = 0;
    this.player.maxReload = 600;
    this.player.selectedPie = "basic";
  }
  createPieSelector(count, type, selectorSize, selectorPadding, border, barWidth, reloadPadding) {
    let posAdd = (count * selectorSize + count * 20) - 100;
    this.pieSelectorGraphics = this.add.graphics().setDepth(3);
    this.pieSelector = this.add.rectangle(selectorPadding * 3, selectorPadding * 3 + posAdd, selectorSize, selectorSize);
    this.pieSelector.setInteractive();
    this.pieSelectorGraphics.lineStyle(border, game.themeColors.notblack);
    this.pieSelectorGraphics.strokeRect(selectorPadding, selectorPadding + posAdd, selectorSize, selectorSize);
    this.pieSelectorImage = this.add.image(selectorPadding + 32 + 16, selectorPadding + 64 + posAdd, "pie").setScale(8).setDepth(3);
    this.pieSelector.on("pointerdown", () => { this.selectedPie = "custard"; });
    this.pieReload = this.add.rectangle(selectorPadding + (selectorSize - barWidth - 0.5) / 2, selectorPadding + reloadPadding + 5 + posAdd, 0, 10, game.themeColors.secondary1).setDepth(3);
    this.pieReload.maxWidth = barWidth;
    this.pieReloadBar = this.add.graphics().setDepth(3);
    this.pieReloadBar.lineStyle(border, game.themeColors.notblack);
    // this.pieReloadBar.strokeRect(selectorPadding + (selectorSize - barWidth - 0.5) / 2, selectorPadding + reloadPadding, barWidth, 10);
  }
  createOpponent(x, y, type, health) {
    new Opponent(this, game, x, y, type, health);
  }
  createEnergyBar(border, barWidth) {
    // Energy bar
    this.player.energyBarGraphics = this.add.graphics().setDepth(2);
    this.player.energyBarGraphics.lineStyle(border, game.themeColors.notblack);
    this.player.energyBarGraphics.strokeRect(0, 0, barWidth, 10);
    this.player.energyBar = this.add.rectangle(0, 0, 0, 10, game.themeColors.secondary2);
  }
  createPie(type) {
    new Pie(this, "custard");
    this.player.holdDur = 0;
    this.player.energyBar.width = 0;
    this.player.reload = 0;
    this.pieReload.width = 0;
  }
  preload() {
    this.engine = new Engine(this);

    // ********** Load assets **********
    // ---------- Load image assets ----------
    this.load.image("cursor", "assets/cursor.png");
    this.load.image("pie", "assets/pie.png");
    this.load.image("player", "assets/player.png");
    this.load.image("arrow", "assets/arrow.png");
    this.load.image("opponent", "assets/opponent.png");
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
    this.pies = this.physics.add.group();
    this.opponents = this.physics.add.group();

    // Create player
    this.createPlayer();

    // Create UI
    this.createPieSelector(1, "custard", SELECTORSIZE, SELECTORPADDING, BORDER, BARWIDTH, RELOADPADDING);
    this.createEnergyBar(BORDER, BARWIDTH);

    // Create arrow
    this.aimerArrow = this.add.image(this.player.x - 10, this.player.y - 20, "arrow").setScale(8);

    // Create opponents
    this.createOpponent(this.engine.gameWidthCenter, this.engine.gameHeight / 4, "basic", 100);

    // Throwing pies
    this.input.on("pointerup", () => { if (this.player.reload >= this.player.maxReload) this.createPie(); });

    // Colliders
    this.physics.add.collider(this.player, this.pies);
    this.physics.add.collider(this.pies, this.pies);
    this.physics.add.overlap(this.pies, this.opponents, (pie, opponent) => {
      console.log(pie.pieObj);
      opponent.opponentObj.updateHealth(-pie.pieObj.power);
      pie.destroy();
    });
  }
  update() {
    this.engine.updatePixelCursor();

    // Movement with WASD during game
    if (!this.player.frozen) {
      if (this.engine.isKeyDown("A")) {
        this.player.setVelocityX(-300);
        this.player.pieDir = -1;
      }
      if (this.engine.isKeyDown("D")) {
        this.player.setVelocityX(300);
        this.player.pieDir = 1;
      }
      if (this.engine.isKeyDown("S")) {
        this.player.setVelocityY(300);
      }
      if (this.engine.isKeyDown("W")) {
        this.player.setVelocityY(-300);
      }
    }

    // Gain energy when holding mouse and reload is maxed out | Also extend the energy bar
    if (this.engine.mouseDown && this.player.holdDur < 500 && this.player.reload >= this.player.maxReload) {
      this.player.holdDur += 5;
      this.player.energyBar.width += 320 / 500;
    }

    // Extend the reload bar
    if (this.player.reload < this.player.maxReload) {
      this.player.reload += 5;
      this.pieReload.width += 320 / this.player.maxReload;
    }

    // Update positions and angles
    this.player.pieAngle += this.player.pieDir * this.player.pieSpeed;
    this.aimerArrow.x = this.player.x - 10;
    this.aimerArrow.y = this.player.y - 20;
    this.aimerArrow.angle = this.player.pieAngle + 140;
    this.player.energyBarGraphics.x = this.player.x - 43;
    this.player.energyBarGraphics.y = this.player.y + 30;
    this.player.energyBar.x = this.player.x - 43;
    this.player.energyBar.y = this.player.y + 35;

    // Update all opponents
    this.spritesInGroup(this.opponents, (opponent) => {
      opponent.opponentObj.updateHeatlhBarPos();
    });
  }
}
