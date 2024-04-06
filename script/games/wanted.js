class Wanted extends Default {
  #characters = {
    'red':[255,100,100],
    'green':[100,255,100],
    'blue':[100,100,255],
    'yellow':[255,255,0],
  }
  #suspects = []; // 容疑者一覧
  #culprit; // 犯人
  #flow = 0;  // 0:容疑者選出 1:選別中 2:正解 3:ゲームオーバー
  #margin = 30;
  #size = 35;
  #reflection;

  preload(p) {

  }

  setup() {
    
  }

  view(p) {
    p.background(0);

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
          p.stroke(255);
          p.fill(color);
          p.rect(suspect.x, suspect.y + config.height, size, this.#size);
        })
        break; 
      case 2:
        
        break;
      case 3:
        
        break; 
      default:
        break;
    }

    p.fill(0);
    p.rect(0, 0, config.width, config.height);
  }

  controller() {

  }

  destroy() {

  }

  // 容疑者選出
  election() {
    const $characters = Object.keys(this.#characters);
    const $random = Math.floor( Math.random() * $characters.length );

    this.#culprit = $characters[$random];
    $characters.splice($random, 1);

    this.generate($characters);
  }

  // 座標生成
  generate(characters) {
    let random;
    let probability;
    let positionX = 0;
    let positionY = 0;
    let x;
    let y;
    let moveX;
    let moveY;
    let moveMode;
    let character;
    let charactersMove = [];
    let direction = [
      'top',
      'left',
      'top-left',
      'top-right',
      'low-top',
      'low-left',
      'low-top-left',
      'low-top-right'
    ];

    // 挙動選択
    this.#reflection = false;
    random =  Math.floor( Math.random() * 3 );
    switch (1) {
      case 0: // 停止状態
        moveMode = 'stop';
        probability = 0.3;
        break;
      case 1: // 直線移動
        moveMode = 'straight';
        probability = 0.4;
        break;
      case 2: // 放射移動
        moveMode = 'radial';
        probability = 0.4;
        if (Math.floor( Math.random() * 2 )) {
          this.#reflection = true;
        } else {
          this.#reflection = false;
        }
        break;
      default:
        break;
    }

    Object.keys(this.#characters).forEach((character) => {
      if (moveMode === 'straight') {

        random = Math.floor( Math.random() * direction.length );

        switch (direction[random]) {
          case 'top':
          case 'low-top':
            if (direction[random] === 'top') {
              moveX = Math.random() * ( 0.005 - 0 ) + 0;
              moveY = Math.random() * ( 0.02 - 0.015 ) + 0.015;
            } else {
              moveX = Math.random() * ( 0.005 - 0 ) + 0;
              moveY = Math.random() * ( 0.015 - 0.01 ) + 0.01;
            }
            
            if (Math.floor( Math.random() * 2 )) {
              moveY = -moveY;
            }
            break;
          case 'left':
          case 'low-left':
            if (direction[random] === 'left') {
              moveX = Math.random() * ( 0.02 - 0.015 ) + 0.015;
              moveY = Math.random() * ( 0.005 - 0 ) + 0;
            } else {
              moveX = Math.random() * ( 0.015 - 0.01 ) + 0.01;
              moveY = Math.random() * ( 0.005 - 0 ) + 0;
            }

            if (Math.floor( Math.random() * 2 )) {
              moveX = -moveX;
            }
            break;
          case 'top-left':
          case 'low-top-left':
            if (direction[random] === 'top-left') {
              moveX = Math.random() * ( 0.02 - 0.015 ) + 0.015;
              moveY = Math.random() * ( 0.02 - 0.015 ) + 0.015;
            } else {
              moveX = Math.random() * ( 0.015 - 0.01 ) + 0.01;
              moveY = Math.random() * ( 0.015 - 0.01 ) + 0.01;
            }

            if (Math.floor( Math.random() * 2 )) {
              moveX = -moveX;
              moveY = -moveY;
            }
            break;
          case 'top-right':
          case 'low-top-right':
            if (direction[random] === 'top-right') {
              moveX = Math.random() * ( 0.02 - 0.015 ) + 0.015;
              moveY = Math.random() * ( 0.02 - 0.015 ) + 0.015;
            } else {
              moveX = Math.random() * ( 0.015 - 0.01 ) + 0.01;
              moveY = Math.random() * ( 0.015 - 0.01 ) + 0.01;
            }

            if (Math.floor( Math.random() * 2 )) {
              moveX = -moveX;
            } else {
              moveY = -moveY;
            }
            break;
          default:
            break;
        }
        direction.splice(random, 1);

      } else if (moveMode === 'radial') {
        switch(Math.floor( Math.random() * 3 )) {
          case 0:
            moveX = Math.random() * ( 0.01 - 0 ) + 0;
            moveY = Math.random() * ( 0.02 - 0.01 ) + 0.01;
            break;
          case 1:
            moveX = Math.random() * ( 0.02 - 0.01 ) + 0.01;
            moveY = Math.random() * ( 0.01 - 0 ) + 0;
            break;
          case 2:
            moveX = Math.random() * ( 0.02 - 0.01 ) + 0.01;
            moveY = Math.random() * ( 0.02 - 0.01 ) + 0.01;
            break;
          default:
            break;
        }
      }
      
      charactersMove[character] = {
        'moveX':moveX,
        'moveY':moveY
      }
    })

    for (let loopY = 0; loopY < 14; loopY++) {
      for (let loopX = 0; loopX < 13; loopX++) {
        if(Math.random() < probability){
          positionX += this.#margin;
          continue;
        }

        x = positionX + Math.random() * ( 5 - -5 ) + -5;
        y = positionY +  Math.random() * ( 5 - -5 ) + -5;

        positionX += this.#margin;

        this.#suspects.push({
          'x':x,
          'y':y,
        });
      }
      positionX = 0;
      positionY += this.#margin;
    }
    this.#suspects = this.arrayShuffle(this.#suspects);

    this.#suspects.forEach((suspect, index) => {
      // キャラクター選択
      if (index === 0) {
        character = this.#culprit;
      } else {
        random = Math.floor( Math.random() * characters.length );
        character = characters[random];
      }

      // 慣性計算
      if (moveMode === 'stop') {
        moveX = 0;
        moveY = 0;
      } else {
        moveX = charactersMove[character]['moveX'];
        moveY = charactersMove[character]['moveY'];

        if (moveMode === 'radial') {
          if (Math.floor( Math.random() * 2 )) {
            [moveX, moveY] = [moveY, moveX];
          }

          if (Math.floor( Math.random() * 2 )) {
            moveX = -moveX;
          }
          
          if (Math.floor( Math.random() * 2 )) {
            moveY = -moveY;
          }
        }
      }

      suspect['character'] = character;
      suspect['moveX'] = moveX;
      suspect['moveY'] = moveY;
    })

    this.#flow = 1;
  }

  arrayShuffle(array) {
    for(let i = (array.length - 1); 0 < i; i--){
      let r = Math.floor(Math.random() * (i + 1));

      let tmp = array[i];
      array[i] = array[r];
      array[r] = tmp;
    }
    return array;
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
        if (suspect.x < 0 - this.#size || suspect.x > config.width + this.#size) {
          suspect.moveX = -(suspect.moveX);
        }
  
        if (suspect.y < 0 - this.#size || suspect.y > config.height + this.#size) {
          suspect.moveY = -(suspect.moveY);
        }
      } else {
        if (suspect.x < 0 - this.#size) {
          suspect.x = config.width + this.#size;
        } else if (suspect.x > config.height + this.#size) {
          suspect.x = 0 - this.#size;
        }
  
        if (suspect.y < 0 - this.#size) {
          suspect.y = config.width + this.#size;
        } else if (suspect.y > config.height + this.#size) {
          suspect.y = 0 - this.#size;
        }
      }

      controller.click(() => { this.judge(suspect.character); }, suspect.x, suspect.y + config.height, this.#size, this.#size);
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