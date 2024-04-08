class Time {
  time = 0;
  endPoint = 0;
  mode = false;
  func = false;
  run = false;
  max = false;

  set(time, mode, func, max = false) {
    this.reset();

    switch (mode) {
      case 'up':
        this.time = 0;
        this.endPoint = time * config.fps;
        break;
      case 'down':
        this.time = time * config.fps;
        this.endPoint = 0;
      default:
        break;
    }
    this.func = func;
    this.mode = mode;
    this.max = max;
  }

  load() {
    if (!this.run) {
      return;
    }

    switch (this.mode) {
      case 'up':
        this.countUp();
        break;
      case 'down':
        this.countDown();
      default:
        break;
    }
  }

  countUp() {
    this.time++;

    if (this.time > this.endPoint) {
      func();
      this.reset();
    }
  }

  countDown() {
    this.time--;

    if (this.time < this.endPoint) {
      this.func();
      this.reset();
    }
  }

  start() {
    this.run = true;
  }

  stop() {
    this.run = false;
  }

  reset() {
    this.time = 0;
    this.endPoint = 0;
    this.mode = false;
    this.func = false;
    this.run = false;
  }

  edit(num) {
    switch (this.mode) {
      case 'up':
        this.endPoint += num * 30;
        if (this.max && this.max * 30 < (this.endPoint + num * 30)) {
          this.endPoint = this.max * 30;
        }
        break;
      case 'down':
        this.time += num * 30;
        if (this.max && this.max * 30 < (this.time + num * 30)) {
          this.time = this.max * 30;
        }
      default:
        break;
    }
  }

  get() {
    return Math.ceil(this.time / 30);
  }
}