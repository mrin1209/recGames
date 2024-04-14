import Menu from '../scenes/menu.js';
import controller from '../engine/controller.js';
import time from '../engine/time.js';

class Games {
  #scene;

  // ゲームスタート
  run(
    p,
    title = Menu
  ) {
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
    time.load();
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

export default new Games;