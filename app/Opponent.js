// Pie-Ball
/*^*^*^*^*^*^*^*
Opponent.js
Opponent class that creates an opponent and places it in the game.

Types of Opponents:
BASIC

*^*^*^*^*^*^*^*/

export class Opponent {
  constructor(_this, x, y, type, health) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.health = health;
    this.opponent = _this.opponents.create(this.x, this.y, "opponent").setScale(8).setGravityY(-1500).setSize(5, 3).setOffset(0, 0).setCollideWorldBounds(true);
    this.opponent.type = this.type;
    this.opponent.health = this.health;
    this.opponent.opponentObj = this;
  }
  updateHealth(num) {
    this.health += num;
    this.opponent.health += num;
    if (this.health <= 0) {
      this.kill();
    }
  }
  kill() {
    this.opponent.destroy();
  }
}
