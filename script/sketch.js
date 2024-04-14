import * as p from './lib/p5.min.js';

import config from './engine/config.js';
import controller from './engine/controller.js';
import games from './engine/games.js';

const sketch = p => {
  p.setup = () => {
    p.createCanvas(config.width, config.height);
    p.frameRate(config.fps);
    games.run(p);
  }

  p.draw = () => {
    games.draw(p);
  }

  p.touchStarted = () => {
    controller.load(p);
  }
}

new p5(sketch, 'id'); 