class Wanted extends Default {
  #characters = {
    '1':[255,100,100],
    '2':[100,255,100],
    '3':[100,100,255],
    '4':[255,100,255],
    '5':[255,255,100],
    '6':[100,255,255],
  }
  #suspects = []; // 容疑者一覧
  #culprit; // 犯人
  #flow = 0;  // 0:容疑者選出 1:選別中 2:正解 3:ゲームオーバー
  #characterNum = 100;
  #margin = 20;
  #size = 30;

  preload(p) {

  }

  setup() {
    
  }

  view(p) {
    switch (this.#flow) {
      case 0:
        this.election();
        break;
      case 1:
        this.#suspects.forEach((suspect) => {
          this.move();
          let color = this.#characters[suspect.character];
          p.fill(color);
          p.rect(suspect.x, suspect.y, this.#size, this.#size);
        })
        break; 
      case 2:
        
        break;
      case 3:
        
        break; 
      default:
        break;
    }
  }

  controller() {

  }

  destroy() {

  }

  // 容疑者選出
  election() {
    const $characters = Object.keys(this.#characters);
    const $length = $characters.length;
    const $random = Math.floor( Math.random() * $length );

    this.#culprit = $characters[$random];

    this.generate();
  }

  // 座標生成
  generate() {
    const characterNum = this.#characterNum;
    const characters = Object.keys(this.#characters);
    const length = characters.length;
    let random;
    let moveX;
    let moveY;
    let isRadial = false;

    // 挙動選択
    random =  Math.floor( Math.random() * 3 );
    switch (random) {
      case 0: // 停止状態
        moveX = 0;
        moveY = 0;
        break;
      case 1: // 直線移動
        moveX = Math.random() * ( 0.01 - -0.01 ) + -0.01;
        moveY = Math.random() * ( 0.01 - -0.01 ) + -0.01;
        break;
      case 2: // 放射移動
        isRadial = true;
        break;
      default:
        break;
    }

    for (let count = 0; count < characterNum; count++) {
      let character;
      let x;
      let y;
      let judge = true;

      // 座標計算
      while (judge) {
        if (this.#suspects.length <= 0) {
          x = Math.floor( Math.random() * 390 );
          y = Math.floor( Math.random() * 390 );
          break;
        } else {
          x = Math.floor( Math.random() * ( 390 + this.#margin - -this.#margin ) + -this.#margin );
          y = Math.floor( Math.random() * ( 390 + this.#margin - -this.#margin ) + -this.#margin );
        }

        if (!this.isOverlapping(this.#suspects[0],x,y)) {
          judge = true;
        } else {
          judge = false;
        }
      }
      
      if (isRadial) {
        moveX = Math.random() * ( 0.01 - -0.01 ) + -0.01;
        moveY = Math.random() * ( 0.01 - -0.01 ) + -0.01;
      }
      
      // キャラクター選択
      judge = true;
      if (count === 0) {
        character = this.#culprit;
      } else {
        while (judge) {
          random = Math.floor( Math.random() * length );

          if (characters[random] != this.#culprit) {
            judge = false;
          }
        }
        character = characters[random];
      }

      this.#suspects.push({
        'x':x,
        'y':y,
        'character':character,
        'moveX':moveX,
        'moveY':moveY,
      })
    }

    this.#flow = 1;
  }

  isOverlapping(suspect,x,y) {
    if (
      (x < (suspect.x + this.#margin) && x > (suspect.x - this.#margin)) &&
      (y < (suspect.y + this.#margin) && y > (suspect.y - this.#margin))
    ) {
      return false;
    } else {
      return true;
    }
  }

  move() {
    controller.reset();

    this.#suspects.forEach((suspect) => {
      suspect.x += suspect.moveX;
      suspect.y += suspect.moveY;

      if (suspect.x < 0 - this.#size) {
        suspect.x = 390 + this.#size;
      } else if (suspect.x > 390 + this.#size) {
        suspect.x = 0 - this.#size;
      }

      if (suspect.y < 0 - this.#size) {
        suspect.y = 390 + this.#size;
      } else if (suspect.y > 390 + this.#size) {
        suspect.y = 0 - this.#size;
      }

      controller.click(() => { this.judge(suspect.character); }, suspect.x, suspect.y, this.#size, this.#size);
    })
  }

  // 正解判定
  judge(character) {
    if(character === this.#culprit) {
      this.#suspects = [];
      controller.reset();
      this.#flow = 0;
    } else {
      
    }
  }

}