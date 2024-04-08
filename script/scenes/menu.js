class Menu extends Default {
  #games = {
    'wanted':Wanted,
  };

  #titles = [];

  #titleCount = 0;
  #x = 0;
  #y = 0;
  #w = 78;
  #h = 117;
  #margin = 0;

  preload(p) {
    const $gameKeys = Object.keys(this.#games);
    
    $gameKeys.forEach((title) => {
      const $key = title;
      const $game = this.#games[$key];
      const $image = p.loadImage(`./assets/img/${$key}/title.jpg`);


      this.#titles.push({
        'id':$key,
        'image':$image
      })

      controller.click(() => { games.run(p,$game); }, this.#x, this.#y, this.#w, this.#h);
      this.nextView();
    })

    this.reset();
  }
  
  view(p) {
    this.#titles.forEach((title) => {
      const $image = title.image;
      
      p.image($image, this.#x, this.#y, this.#w, this.#h);
      this.nextView();
    })

    this.reset();
  }

  reset() {
    this.#titleCount = 0;
    this.#x = 0;
    this.#y = 0;
  }

  nextView() {
    this.#titleCount++;

    if (this.#titleCount % 5 === 0) {
      this.#x = this.#margin;
      this.#y += this.#h + this.#margin;
    } else {
      this.#x += this.#w + this.#margin;
    }
  }
}