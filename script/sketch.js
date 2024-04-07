const config = new Config();
const controller = new Controller();
const menu = new Menu();
const games = new Games();

const sketch = p => {
  p.setup = () => {
    p.createCanvas(390,844);
    p.frameRate(30);
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