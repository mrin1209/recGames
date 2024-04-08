class Wanted extends Default {
  characters = [
    {
      'name':'mario',
      'speed':2
    },
    {
      'name':'yoshi',
      'speed':1.65
    },
    {
      'name':'luigi',
      'img':[69,178,69],
      'speed':1.35
    },
    {
      'name':'wario',
      'img':[255,206,41],
      'speed':1
    },
  ];
  suspects = []; // 容疑者一覧
  culprit; // 犯人
  miss = false;
  flow = 0;  // 0:容疑者選出 1:選別中 2:正解 3:ゲームオーバー
  marginX = 29.8;
  marginY = 30.3;
  size = 50;
  reflection;
  count = 0;

  preload(p) {
    this.backgroundImg = p.loadImage('./assets/img/wanted/background.png');
    this.characterImgs = {
      'mario':p.loadImage('./assets/img/wanted/characters/mario.png'),
      'yoshi':p.loadImage('./assets/img/wanted/characters/yoshi.png'),
      'luigi':p.loadImage('./assets/img/wanted/characters/luigi.png'),
      'wario':p.loadImage('./assets/img/wanted/characters/wario.png'),
    };
    // this.suspectImgs = {
    //   'mario':p.loadImage('./assets/img/wanted/suspects/mario.png'),
    //   'yoshi':p.loadImage('./assets/img/wanted/suspects/yoshi.png'),
    //   'luigi':p.loadImage('./assets/img/wanted/suspects/luigi.png'),
    //   'wario':p.loadImage('./assets/img/wanted/suspects/wario.png'),
    // }
  }

  setup() {
    
  }

  view(p) {
    switch (this.flow) {
      case 0:
        if (this.count === 0) {
          this.election();
        } else if (this.count > 60) {
          this.count = 0;
          this.flow++;
        }
        p.image(this.backgroundImg, 0, 0);
        p.image(this.characterImgs[this.culprit], (config.width / 2) - this.size, (config.height / 2) - this.size, this.size, this.size);
        this.count++;
        break;
      case 1:
        controller.reset();
        p.background(0);
        this.suspects.forEach((suspect) => {
          p.image(this.characterImgs[suspect.character], suspect.x, suspect.y, this.size, this.size);
          this.move(suspect);
        });

        if (this.miss) {
          this.miss = false;
        }
        break;
      case 2:
        p.background(255, 231, 66);
        p.image(this.characterImgs[this.suspects.character], this.suspects.x, this.suspects.y, this.size, this.size);
        this.count++;
        if (this.count > 60) {
          this.suspects = [];
          this.count = 0;
          this.flow = 0;
        }
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
    const characters = this.characters.slice();
    const random = Math.floor( Math.random() * characters.length );

    this.culprit = characters[random].name;
    characters.splice(random, 1);

    this.generate(characters);
  }

  // 座標生成
  generate(characters) {
    let moveMode;
    let probability;
    let positionX = -8;
    let positionY = 0;
    let x;
    let y;
    let moveX;
    let moveY;
    let character;

    [moveMode, probability, this.reflection] = this.setMoveMode();

    const charactersMove = this.setMove(moveMode);

    for (let loopY = 0; loopY < 21; loopY++) {
      for (let loopX = 0; loopX < 13; loopX++) {
        if(Math.random() < probability){
          positionX += this.marginX;
          continue;
        }

        x = positionX;
        y = positionY;

        x += Math.random() * ( 2.5 - -2.5 ) + -2.5;
        y += Math.random() * ( 2.5 - -2.5 ) + -2.5;

        positionX += this.marginX;

        this.suspects.push({
          'x':x,
          'y':y,
        });
      }
      positionX = -7;
      positionY += this.marginY;
    }

    this.suspects = this.arrayShuffle(this.suspects);

    this.suspects.forEach((suspect, index) => {
      // キャラクター選択
      if (index === 0) {
        character = this.culprit;
      } else {
        let random = Math.floor( Math.random() * characters.length );
        character = characters[random].name;
      }

      // 慣性計算
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

      suspect['character'] = character;
      suspect['moveX'] = moveX;
      suspect['moveY'] = moveY;
    })
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
        probability = 0.15;
        reflection = false;
        break;
      case 1: // 直線移動
        moveMode = 'straight';
        probability = 0.05;
        reflection = false;
        break;
      case 2: // 放射移動
        moveMode = 'radial';
        probability = 0.1;
        reflection = true;
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
            moveX = Math.random() * ( 1 - -0.5 ) + -0.5;
            moveY = character['speed'];
            
            if (Math.floor( Math.random() * 2 )) {
              moveY = -moveY;
            }
            break;
          case 'left':
            moveX = character['speed'];
            moveY = Math.random() * ( 1 - -0.5 ) + -0.5;
  
            if (Math.floor( Math.random() * 2 )) {
              moveX = -moveX;
            }
            break;
          case 'top-left':
          case 'top-right':
            moveX = character['speed'];
            moveY = character['speed'];

            if (Math.floor( Math.random() * 2 )) {
              moveX -= Math.random() * ( 1 - -0.5 ) + -0.5;
            } else {
              moveY -= Math.random() * ( 1 - -0.5 ) + -0.5;
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
            moveX = Math.random();
            moveY = character['speed'];
            break;
          case 1:
            moveX = character['speed'];
            moveY = Math.random();
            break;
          case 2:
            moveX = character['speed'];
            moveY = character['speed'];

            if (Math.floor( Math.random() * 2 )) {
              moveX -= Math.random();
            } else {
              moveY -= Math.random();
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

  move(suspect) {
    suspect.x += suspect.moveX;
    suspect.y += suspect.moveY;
    
    if (this.reflection) {
      if (suspect.x < 0 - this.size || suspect.x > config.width) {
        suspect.moveX = -(suspect.moveX);
      }

      if (suspect.y < 0 - this.size || suspect.y > config.height) {
        suspect.moveY = -(suspect.moveY);
      }
    } else {
      if (suspect.x < 0 - this.size) {
        suspect.x = config.width;
      } else if (suspect.x > config.width) {
        suspect.x = 0 - this.size;
      }

      if (suspect.y < 0 - this.size) {
        suspect.y = config.height;
      } else if (suspect.y > config.height) {
        suspect.y = 0 - this.size;
      }
    }

    controller.click(() => { this.judge(suspect); }, suspect.x, suspect.y, this.size, this.size);
  }

  // 正解判定
  judge(suspect) {
    if(suspect.character === this.culprit) {
      controller.reset();
      this.suspects = suspect;
      this.miss = false;
      this.flow++;
    } else {
      this.miss = suspect;
    }
  }
}