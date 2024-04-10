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
  count = 0;
  setUp = false;
  viewText = false;
  lightSize = 250;
  lightSpeed = 20;
  lightMove = 0;
  light = {
    'left': -(this.lightSize / 2),
    'right': config.width + (this.lightSize / 2)
  }

  preload(p) {
    this.backgroundImg = p.loadImage('./assets/img/wanted/background.png');
    this.characterImgs = {
      'mario':p.loadImage('./assets/img/wanted/characters/mario.png'),
      'yoshi':p.loadImage('./assets/img/wanted/characters/yoshi.png'),
      'luigi':p.loadImage('./assets/img/wanted/characters/luigi.png'),
      'wario':p.loadImage('./assets/img/wanted/characters/wario.png'),
    };
    this.suspectImgs = {
      'mario':p.loadImage('./assets/img/wanted/suspects/mario.png'),
      'yoshi':p.loadImage('./assets/img/wanted/suspects/yoshi.png'),
      'luigi':p.loadImage('./assets/img/wanted/suspects/luigi.png'),
      'wario':p.loadImage('./assets/img/wanted/suspects/wario.png'),
    }
    this.touch_to_start = p.loadImage('./assets/img/common/touch_to_start.png');
  }

  setup() {
    time.set(
      60,
      'down',
      () => { this.timeUp() },
      60
    );

    this.election();
  }

  view(p) {
    switch (this.flow) {
      case 0: // 犯人選出
        p.background(0);

        p.push();
        p.beginClip();
        p.ellipse(this.light['left'], config.height / 2, this.lightSize, this.lightSize);
        p.ellipse(this.light['right'], config.height / 2, this.lightSize, this.lightSize);
        p.endClip();

        p.imageMode(p.CENTER);
        p.image(this.backgroundImg, (config.width / 2), (config.height / 2), config.width, this.backgroundImg.height + (config.width - this.backgroundImg.width ) );
        p.image(this.suspectImgs[this.culprit], (config.width / 2), (config.height / 2) - 17, 115, 115);
        p.pop();

        switch (this.lightMove) {
          case 0:
            if (this.light['left'] > config.width + (this.lightSize / 2)) {
              this.lightMove = 1;
            } else {
              this.light['left'] += this.lightSpeed;
              this.light['right'] -= this.lightSpeed;
            }
            break;
          case 1:
            if ((this.light['right'] + this.lightSpeed) > (config.width / 2)) {
              this.light['left'] = config.width / 2;
              this.light['right'] = config.width / 2;
              this.lightMove = 2;
            } else {
              this.light['left'] -= this.lightSpeed;
              this.light['right'] += this.lightSpeed;
            }
            break;
          case 2:
            if (!this.setUp) {
              controller.click(() => {
                this.light['left'] = config.width + (this.lightSize / 2);
                this.light['right'] = -(this.lightSize / 2);
                this.lightMove = 1;
                this.flow = 1;
                this.count = 0;
                this.setUp = false;
                time.start();
              });
              this.setUp = true;
            }

            this.count++;
            if (this.count < 20)  {
              this.viewText = true;
            } else if (this.count < 40)  {
              this.viewText = false;
            } else if (this.count > 40)  {
              this.count = 0;
            }

            if (this.viewText) {
              p.push();
              p.imageMode(p.CENTER);
              p.image(
                this.touch_to_start,
                config.width / 2,
                config.height / 2 + 150,
              );
              p.pop();
            }
            break;
          default:
            break;
        }
        break;
      case 1: // プレイ中
        controller.reset();
        p.background(0);

        this.suspects.forEach((suspect) => {
          if (suspect['view']) {
            p.image(this.characterImgs[suspect.character], suspect.x, suspect.y, this.size, this.size);
          }

          if (suspect['miss']) {
            if (suspect['missCount'] > 30) {
              suspect['miss'] = false;
              suspect['view'] = true;
              suspect['missCount'] = 0;
            } else if (suspect['missCount'] % 2 === 0) {
              suspect['view'] = !suspect['view'];
            }
            suspect['missCount']++;
          }

          this.move(suspect, p);
        });

        if (this.miss) {
          time.edit(-10);
          this.miss['miss'] = true;
          this.miss = false;
        }

        p.fill(255);
        p.textSize(30);
        p.strokeWeight(10);
        p.stroke(0);
        p.textAlign(p.LEFT, p.TOP);
        p.text(time.get(), 5, 5);
        break;
      case 2: // 答え合わせ
        if (!this.setUp) {
          controller.reset();
          time.stop();
          this.setUp = true;
        }

        p.background(255, 231, 66);
        p.image(this.characterImgs[this.suspects.character], this.suspects.x, this.suspects.y, this.size, this.size);

        if (time.get() > 0) {
          if (this.count > 90) {
            this.election();
            time.edit(5);
            this.count = 0;
            this.setUp = false;
            this.miss = false;
            this.flow = 0;
          } else {
            this.count++;
          }
        } else {
          p.fill(255);
          p.textSize(30);
          p.strokeWeight(10);
          p.stroke(0);
          p.textAlign(p.CENTER);
          p.text('Game Over', config.width / 2, config.height / 2);
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
    this.suspects = [];
    let positionX = -8;
    let positionY = this.marginY;
    let x;
    let y;
    let moveX;
    let moveY;
    let positionList = [];
    let character;

    let probability = this.setMoveMode();

    const charactersMove = this.setMove();

    for (let loopY = 0; loopY < 20; loopY++) {
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

        positionList.push({
          'x':x,
          'y':y,
        });
      }
      positionX = -7;
      positionY += this.marginY;
    }

    positionList = this.arrayShuffle(positionList);

    positionList.forEach((position, index) => {
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

      if (this.moveMode === 'radial') {
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

      this.suspects.push(new Suspect(
        character,
        position['x'],
        position['y'],
        moveX,
        moveY,
        charactersMove[character]['amplitude'],
        charactersMove[character]['speed'],
        charactersMove[character]['angle'],
      ));
    })
  }

  // 挙動選択
  setMoveMode() {
    let probability;
    const random =  Math.floor( Math.random() * 4 );
    switch (3) {
      case 0: // 停止状態
        this.moveMode = 'stop';
        probability = 0.15;
        this.reflection = false;
        break;
      case 1: // 直線移動
        this.moveMode = 'straight';
        probability = 0.05;
        this.reflection = false;
        break;
      case 2: // 放射移動
        this.moveMode = 'radial';
        probability = 0.1;
        this.reflection = true;
        break;
      case 3: // 振り子移動
        this.moveMode = 'wave';
        probability = 0.1;
        this.reflection = false;
        break;
      default:
        break;
    }

    return probability;
  }

  setMove() {
    let charactersMove = [];
    let moveX;
    let moveY;
    const direction = [
      'top',
      'left',
      'top-left',
      'top-right',
    ];
    let amplitude;
    let speed;
    let angle;

    this.characters.forEach((character) => {
      if (this.moveMode === 'stop') {
        moveX = 0;
        moveY = 0;
      } else if (this.moveMode === 'straight') {
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
      } else if (this.moveMode === 'radial') {
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
      } else if (this.moveMode === 'wave') {
        moveX = 0;
        moveY = character['speed'];

        amplitude = Math.floor( Math.random() * ( 50 - 25 ) + 25 );
        speed =  Math.random() * ( 0.08 - 0.025 ) + 0.025;
        angle = Math.random() * 3.14;
      }
      
      charactersMove[character['name']] = new Character(
        character['name'],
        moveX,
        moveY,
        amplitude,
        speed,
        angle
      );
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

  move(suspect, p) {
    if (this.moveMode === 'wave') {
      suspect.x = suspect.center + suspect.amplitude * p.cos(suspect.angle);
      suspect.y += suspect.moveY;
      suspect.angle += suspect.speed;
      if (suspect.angle >= p.TWO_PI) {
        suspect.angle = 0;
      }
    } else {
      suspect.x += suspect.moveX;
      suspect.y += suspect.moveY;
    }
    
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

  timeUp() {
    this.suspects = this.suspects[0];
    this.flow = 2;
  }
}

class Suspect {
  view = true;
  miss = false;
  missCount = 0;

  constructor(
    character,
    x,
    y,
    moveX,
    moveY,
    amplitude = 0,
    speed = 0,
    angle = 0
  ) {
    this.character = character;
    this.x = x;
    this.y = y;
    this.moveX = moveX;
    this.moveY = moveY;
    this.amplitude = amplitude;
    this.speed = speed;
    this.center = x;
    this.angle = angle;
  }
}

class Character {
  constructor(
    character,
    moveX,
    moveY,
    amplitude = 0,
    speed = 0,
    angle = 0,
  ) {
    this.character = character;
    this.moveX = moveX;
    this.moveY = moveY;
    this.amplitude = amplitude;
    this.speed = speed;
    this.angle = angle;
  }
}