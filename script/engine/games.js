class Games {
  #scene;

  // ゲームスタート
  run(p,title) {
    controller.reset();

    this.#scene = new title;
    this.#scene.preload(p);
    this.#scene.setup();
  }

  // ゲームスタート
  draw(p) {
    p.clear();
    this.#scene.view(p);
    this.#scene.controller(p);
  }

  // 一時停止
  pause() {

  }

  // ゲーム終了
  stop() {
    this.#scene.destroy();
    controller.reset();
    this.#scene = new Menu;
  }

  // セーブ
  save() {

  }

  // ロード
  laod() {

  }
}