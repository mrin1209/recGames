const config = new Config();
const controller = new Controller();
const time = new Time();
const menu = new Menu();
const games = new Games();

const sketch = p => {
  p.setup = () => {
    p.createCanvas(config.width, config.height);
    p.frameRate(config.fps);
    games.run(p,Menu);
    
  }

  p.draw = () => {
    games.draw(p);
  }

  p.touchStarted = () => {
    controller.load(p);
  }
}

new p5(sketch, 'id'); 