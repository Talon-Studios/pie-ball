// Pie-Ball
/*^*^*^*^*^*^*^*
Pie.js
Pie class that creates an pie and flings it.

Types of Pies:
CUSTARD

*^*^*^*^*^*^*^*/

export class Pie {
 constructor(_this, type) {
   this.pie = _this.pies.create(_this.player.x, _this.player.y, "pie");
   this.pie.pieObj = this;
   this.pie.setScale(8);
   this.pie.setSize(6, 4);
   this.pie.setOffset(0, 0);
   this.pie.setGravityY(-1500);
   this.pie.setDepth(1);
   this.type = type;
   this.power = (_this.player.holdDur / 5) / 2;
   _this.physics.velocityFromAngle(_this.player.pieAngle, _this.player.holdDur, this.pie.body.velocity);
 }
}
