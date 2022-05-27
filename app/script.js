// Pie-Ball
/*^*^*^*^*^*^*^*
script.js
The main script for Pie-Ball.
*^*^*^*^*^*^*^*/

class Game extends Phaser.Scene {
  constructor() {
    super();
  }
  preload() {
    this.engine = new Engine(this);

    // Load image assets
    this.load.image("cursor", "assets/cursor.png");
  }
  create() {
    this.engine.pixelCursor();
  }
  update() {
    this.engine.updatePixelCursor();
  }
}
