class Controller {
  clickList = [];
  
  constructor() {
    this.reset();
  }

  reset() {
    this.clickList = [];
  }

  load(p) {
    this.clickList.forEach(val => {
      if (p.mouseX >= val.x && p.mouseX <= (val.x+val.w) && p.mouseY >= val.y && p.mouseY <= (val.y+val.h)) {
        val.func();
      }
    });
  }

  click(
    func,
    x = 0,
    y = 0,
    w = config.width,
    h = config.height
  ) {
    this.clickList.push({
      'func':func,
      'x':x,
      'y':y,
      'w':w,
      'h':h,
    });
  }
}