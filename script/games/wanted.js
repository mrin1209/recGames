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
  #reflection;

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
        const size = this.#size;
        const characters = this.#characters;
        this.#suspects.forEach((suspect) => {
          this.move();
          let color = characters[suspect.character];
          p.fill(color);
          p.rect(suspect.x, suspect.y, size, this.#size);
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
    let moveMode;
    let straightList = [];

    // 挙動選択
    random =  Math.floor( Math.random() * 3 );
    switch (random) {
      case 0: // 停止状態
        moveMode = 'stop';
        moveX = 0;
        moveY = 0;
        this.#reflection = false;
        break;
      case 1: // 直線移動
        moveMode = 'straight';

        Object.keys(this.#characters).forEach((character) => {
          moveX = Math.random() * ( 0.01 - -0.01 ) + -0.01;
          moveY = Math.random() * ( 0.01 - -0.01 ) + -0.01;

          straightList[character] = {
            'moveX':moveX,
            'moveY':moveY
          }
        })
        
        this.#reflection = false;
        break;
      case 2: // 放射移動
        moveMode = 'radial';
        if (Math.floor( Math.random() * 2 )) {
          this.#reflection = true;
        } else {
          this.#reflection = false;
        }
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
          x = Math.floor( Math.random() * ( 390 + -this.#margin - this.#margin ) + this.#margin );
          y = Math.floor( Math.random() * ( 390 + -this.#margin - this.#margin ) + this.#margin );
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
      
      // キャラクター選択
      judge = true;
      if (this.#suspects.length <= 0) {
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

      // 慣性計算
      switch (moveMode) {
        case 'straight':
          moveX = straightList[character]['moveX'];
          moveY = straightList[character]['moveY'];
          break;
        case 'radial':
          moveX = Math.random() * ( 0.01 - -0.01 ) + -0.01;
          moveY = Math.random() * ( 0.01 - -0.01 ) + -0.01;
        default:
          break;
      }

      this.#suspects.push({
        'x':x,
        'y':y,
        'character':character,
        'moveX':moveX,
        'moveY':moveY,
      });
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

      if (this.#reflection) {
        if (suspect.x < 0 - this.#size || suspect.x > 390 + this.#size) {
          suspect.moveX = -(suspect.moveX);
        }
  
        if (suspect.y < 0 - this.#size || suspect.y > 390 + this.#size) {
          suspect.moveY = -(suspect.moveY);
        }
      } else {
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