class Wanted extends Default {
  characters = [
    {
      'name':'red',
      'img':[255,100,100],
      'speed':0.025
    },
    {
      'name':'green',
      'img':[100,255,100],
      'speed':0.02
    },
    {
      'name':'blue',
      'img':[100,100,255],
      'speed':0.015
    },
    {
      'name':'yellow',
      'img':[255,255,0],
      'speed':0.01
    },
  ];
  suspects = []; // 容疑者一覧
  culprit; // 犯人
  flow = 0;  // 0:容疑者選出 1:選別中 2:正解 3:ゲームオーバー
  margin = 30;
  size = 35;
  reflection;

  preload(p) {

  }

  setup() {
    
  }

  view(p) {
    p.background(0);

    switch (this.flow) {
      case 0:
        this.election();
        break;
      case 1:
        const size = this.size;
        this.suspects.forEach((suspect) => {
          p.fill(suspect.character.img);
          p.rect(suspect.x, suspect.y + config.height, size, this.size);

          this.move();
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
    const characters = this.characters.slice();
    const random = Math.floor( Math.random() * characters.length );

    this.culprit = characters[random];
    characters.splice(random, 1);

    this.generate(characters);
  }

  // 座標生成
  generate(characters) {
    let moveMode;
    let probability;
    let positionX = 0;
    let positionY = 0;
    let x;
    let y;
    let moveX;
    let moveY;
    let character;

    [moveMode, probability, this.reflection] = this.setMoveMode();

    const charactersMove = this.setMove(moveMode);

    for (let loopY = 0; loopY < 14; loopY++) {
      for (let loopX = 0; loopX < 13; loopX++) {
        if(Math.random() < probability){
          positionX += this.margin;
          continue;
        }

        x = positionX + Math.random() * ( 5 - -5 ) + -5;
        y = positionY +  Math.random() * ( 5 - -5 ) + -5;

        positionX += this.margin;

        this.suspects.push({
          'x':x,
          'y':y,
        });
      }
      positionX = 0;
      positionY += this.margin;
    }

    this.suspects = this.arrayShuffle(this.suspects);

    this.suspects.forEach((suspect, index) => {
      // キャラクター選択
      if (index === 0) {
        character = this.culprit;
      } else {
        let random = Math.floor( Math.random() * characters.length );
        character = characters[random];
      }

      // 慣性計算
      moveX = charactersMove[character['name']]['moveX'];
      moveY = charactersMove[character['name']]['moveY'];

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

      suspect['character'] = character;
      suspect['moveX'] = moveX;
      suspect['moveY'] = moveY;
    })

    this.flow = 1;
  }

  // 挙動選択
  setMoveMode() {
    let moveMode;
    let probability;
    let reflection;
    const random =  Math.floor( Math.random() * 3 );
    switch (random) {
      case 0: // 停止状態
        moveMode = 'stop';
        probability = 0.3;
        reflection = false;
        break;
      case 1: // 直線移動
        moveMode = 'straight';
        probability = 0.4;
        reflection = false;
        break;
      case 2: // 放射移動
        moveMode = 'radial';
        probability = 0.4;
        if (Math.floor( Math.random() * 2 )) {
          reflection = true;
        } else {
          reflection = false;
        }
        break;
      default:
        break;
    }

    return [moveMode, probability, reflection];
  }

  setMove(moveMode) {
    let charactersMove = [];
    let moveX;
    let moveY;
    const direction = [
      'top',
      'left',
      'top-left',
      'top-right',
    ];

    this.characters.forEach((character) => {
      if (moveMode === 'stop') {
        moveX = 0;
        moveY = 0;
      } else if (moveMode === 'straight') {
        const random = Math.floor( Math.random() * direction.length );
  
        switch (direction[random]) {
          case 'top':
            moveX = Math.random() * ( 0.005 - -0.005 ) + -0.005;
            moveY = character['speed'];
            
            if (Math.floor( Math.random() * 2 )) {
              moveY = -moveY;
            }
            break;
          case 'left':
            moveX = character['speed'];
            moveY = Math.random() * ( 0.005 - -0.005 ) + -0.005;
  
            if (Math.floor( Math.random() * 2 )) {
              moveX = -moveX;
            }
            break;
          case 'top-left':
          case 'top-right':
            moveX = character['speed'];
            moveY = character['speed'];

            if (Math.floor( Math.random() * 2 )) {
              moveX -= Math.random() * ( 0.005 - -0.005 ) + -0.005;
            } else {
              moveY -= Math.random() * ( 0.005 - -0.005 ) + -0.005;
            }
  
            if (direction[random] === 'top-left') {
              if (Math.floor( Math.random() * 2 )) {
                moveX = -moveX;
                moveY = -moveY;
              }
            } else if (direction[random] === 'top-right') {
              if (Math.floor( Math.random() * 2 )) {
                moveX = -moveX;
              } else {
                moveY = -moveY;
              }
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
            moveY = character['speed'];
            break;
          case 1:
            moveX = character['speed'];
            moveY = Math.random() * ( 0.01 - 0 ) + 0;
            break;
          case 2:
            moveX = character['speed'];
            moveY = character['speed'];

            if (Math.floor( Math.random() * 2 )) {
              moveX -= Math.random() * 0.005;
            } else {
              moveY -= Math.random() * 0.005;
            }
            break;
          default:
            break;
        }
      }
      
      charactersMove[character['name']] = {
        'moveX':moveX,
        'moveY':moveY
      }
    })
    return charactersMove;
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

  move() {
    controller.reset();

    this.suspects.forEach((suspect) => {
      suspect.x += suspect.moveX;
      suspect.y += suspect.moveY;

      if (this.reflection) {
        if (suspect.x < 0 - this.size || suspect.x > config.width + this.size) {
          suspect.moveX = -(suspect.moveX);
        }
  
        if (suspect.y < 0 - this.size || suspect.y > config.height + this.size) {
          suspect.moveY = -(suspect.moveY);
        }
      } else {
        if (suspect.x < 0 - this.size) {
          suspect.x = config.width + this.size;
        } else if (suspect.x > config.height + this.size) {
          suspect.x = 0 - this.size;
        }
  
        if (suspect.y < 0 - this.size) {
          suspect.y = config.width + this.size;
        } else if (suspect.y > config.height + this.size) {
          suspect.y = 0 - this.size;
        }
      }

      controller.click(() => { this.judge(suspect.character); }, suspect.x, suspect.y + config.height, this.size, this.size);
    })
  }

  // 正解判定
  judge(character) {
    if(character === this.culprit) {
      this.suspects = [];
      controller.reset();
      this.flow = 0;
    } else {
      
    }
  }

}