export default class Default {
  #title;
  #id;

  constructor(
    title,
    id
  ) {
    this.#title = title,
    this.#id = id
  }

  get getTitle() {
    return this.#title;
  }

  get getId() {
    return this.#id;
  }

  preload(p) {}

  setup() {}

  view() {}

  controller() {}

  destroy() {}
}