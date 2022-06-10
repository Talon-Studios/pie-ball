// Pie-Ball
/*^*^*^*^*^*^*^*
Opponent.js
Opponent class that creates an opponent and places it in the game.

Types of Opponents:
BASIC

*^*^*^*^*^*^*^*/

export class Opponent {
  constructor(_this, game, x, y, type, health) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.maxHealth = health;
    this.health = this.maxHealth;
    this.game = game;
    this.opponent = _this.opponents.create(this.x, this.y, "opponent").setScale(8).setGravityY(-1500).setSize(5, 3).setOffset(0, 0).setCollideWorldBounds(true);
    this.opponent.type = this.type;
    this.opponent.health = this.health;
    this.opponent.opponentObj = this;

    this.createHealthBar(_this, 65, 3);
  }
  updateHealth(num) {
    this.health += num;
    this.opponent.health += num;
    this.updateHealthBar();
    if (this.health <= 0) {
      this.kill();
    }
  }
  kill() {
    this.opponent.destroy();
    this.opponent.healthBarGraphics.destroy();
    this.opponent.healthBar.destroy();
  }
  createHealthBar(_this, barWidth, border) {
    this.opponent.healthBarGraphics = _this.add.graphics().setDepth(2);
    this.opponent.healthBarGraphics.lineStyle(border, this.game.themeColors.notblack);
    this.opponent.healthBarGraphics.strokeRect(0, 0, barWidth, 10);
    this.opponent.healthBar = _this.add.rectangle(0, 0, barWidth, 10, this.game.themeColors.secondary2);
  }
  updateHealthBar() {
    // Find 1% of 65 and multiply it by the health
    this.opponent.healthBar.width = (65 / 100) * this.health;
  }
  updateHeatlhBarPos() {
    this.opponent.healthBarGraphics.x = this.opponent.x - 43;
    this.opponent.healthBarGraphics.y = this.opponent.y - 65;
    this.opponent.healthBar.x = this.opponent.x - 10.5;
    this.opponent.healthBar.y = this.opponent.y - 60;
  }
}
