// Pie-Ball
/*^*^*^*^*^*^*^*
config.js
The configuration for the Phaser 3 framework.
*^*^*^*^*^*^*^*/

import {GameScene} from "./script.js";

const config = {
  type: Phaser.AUTO,
  scale: {
    autoCenter: Phaser.Scale.CENTER_BOTH,
    mode: Phaser.Scale.RESIZE
  },
  render: {
    pixelArt: true
  },
  backgroundColor: 0xffffff,
  physics: {
    default: "arcade",
    arcade: {
      gravity: {
        y: 1500
      },
      enableBody: true,
      // debug: true
    }
  },
  scene: [GameScene]
};
const phaserGame = new Phaser.Game(config);
