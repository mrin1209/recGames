class Where extends Default {
  characters = [
    {
      'name':'mario',
    },
    {
      'name':'yoshi',
    },
    {
      'name':'luigi',
    },
    {
      'name':'wario',
    },
  ];
  suspects = []; // 容疑者一覧
  culprit; // 犯人
  characterNum = 200;
  miss = false;
  flow = 0;  // 0:容疑者選出 1:選別中 2:正解 3:ゲームオーバー
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
        let index;
        controller.reset();
        p.background(0);

        this.suspects.forEach((suspect, index) => {
          controller.click(() => { this.touche = suspect; }, suspect.x, suspect.y, this.size, this.size);

          if (suspect.touche) {
            index = index;
            p.image(this.characterImgs[suspect.character], suspect.x, suspect.y, this.size + 5, this.size + 5);
          } else {
            p.image(this.characterImgs[suspect.character], suspect.x, suspect.y, this.size, this.size);
          }
        });
        
        if (p.touches[0] && this.touche) {
          if(this.touche.character === this.culprit) {
            controller.reset();
            this.suspects = this.touche;
            this.touche = false;
            this.flow++;
          } else {
            this.suspects = this.suspects.filter( a => a !== this.touche).concat(this.suspects.filter( b => b === this.touche));
            this.touche['touche'] = true;
            this.touche['x'] = p.touches[0]['x'] - this.size / 2;
            this.touche['y'] = p.touches[0]['y'] - this.size / 2;
          }
        } else if (this.touche) {
          this.touche['touche'] = false;
          this.touche = false;
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
          this.touche = false;
          this.setUp = true;
        }

        p.background(255, 231, 66);
        p.image(this.characterImgs[this.suspects.character], this.suspects.x, this.suspects.y, this.size, this.size);

        if (time.get() > 0) {
          if (this.count > 90) {
            this.election();
            time.edit(60);
            this.count = 0;
            this.setUp = false;
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

  controller(p) {
    
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
    let x;
    let y;
    let positionList = [];
    let character;

    for (let count = 0; count < this.characterNum; count++) {
      x = Math.floor( Math.random() * ( (config.width - this.size + 8 ) - -8 ) + -8);
      y = Math.floor( Math.random() * ( (config.height - this.size ) - 0 ) + 0);

      positionList.push({
        'x':x,
        'y':y,
      });
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

      this.suspects.push(new Suspect(
        character,
        position['x'],
        position['y'],
      ));
    })
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

  timeUp() {
    this.suspects = this.suspects[0];
    this.flow = 2;
  }
}

class Suspect {
  touche = false;

  constructor(
    character,
    x,
    y,
  ) {
    this.character = character;
    this.x = x;
    this.y = y;
  }
}