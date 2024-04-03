class Controller {
  clickList = [];
  
  constructor() {
    this.reset();
  }

  reset() {
    this.clickList = [];
  }

  load(p) {
    let clicked = true;
    this.clickList.forEach(val => {
      if (p.mouseX >= val.x && p.mouseX <= (val.x+val.w) && p.mouseY >= val.y && p.mouseY <= (val.y+val.h) && clicked) {
        val.func();
        clicked = false;
      }
    });
  }

  click(
    func,
    x = 0,
    y = 0,
    w = windowWidth,
    h = windowHeight
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