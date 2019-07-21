//panel関連処理
class Panel {
  constructor(panel, assets) {
    this.canvas = document.getElementById(panel);
    this.context = this.canvas.getContext("2d");
    this.assets = assets;
    this.operate = false;                 //パネル画面が操作可能か判定。true->スクリーンが操作不可　false->スクリーンが操作可能
    this.handler = this.createHandler();
    this.buttonState = {num: 0, x: 0, y: Setting.panelPartsOffset};   //ボタン生成状況 num->ボタンの数、x->生成位置x、y->生成位置y
    this.buttonType = {
      cancel: {
        key: 0,
        value: "キャンセル",
        listener: (event, range, callback) => {
          let mousePos = this.fixPoint(event);
          if(this.buttonCollision(mousePos, range, callback)) {
            callback();
            this.init();
          }
        }
      },
      skip: {
        key: 1,
        value: "スキップ",
        listener: (event, range, callback) => {
          let mousePos = this.fixPoint(event);
          if(this.buttonCollision(mousePos, range)) {
            callback();
            this.init();
          }
        }
      },
      lizhi: {
        key: 2,
        value: "リーチ",
        listener: (event, range, callback) => {
          let mousePos = this.fixPoint(event);
          if(this.buttonCollision(mousePos, range)) {
            callback();
            this.init();
          }
        }
      },
      furo: {
        key: 3,
        value: "鳴く",                  //明槓を含む
        listener: (event, range, callback) => {
          this.pressButton(event, range, callback);
        }
      },
      ankan: {
        key: 4,
        value: "暗槓",                //暗槓（明槓は含まない）
        listener: (event, range, callback) => {
          this.pressButton(event, range, callback);
        }
      },
      kakan: {
        key: 5,
        value: "加槓",                //加槓（明槓は含まない）
        listener: (event, range, callback) => {
          this.pressButton(event, range, callback);
        }
      },
      ron: {
        key: 6,
        value: "ロン",
        listener: (event, range, callback) => {
          let mousePos = this.fixPoint(event);
          if(this.buttonCollision(mousePos, range)) {
            callback();
            this.handler.removeListener();
            this.operate = false;
            this.buttonState = {num: 0, x: 0, y: Setting.panelPartsOffset};
          }
        }
      },
      tumo: {
        key: 7,
        value: "ツモ",
        listener: (event, range, callback) => {
          let mousePos = this.fixPoint(event);
          if(this.buttonCollision(mousePos, range)) {
            callback();
            this.handler.removeListener();
            this.operate = false;
            this.buttonState = {num: 0, x: 0, y: Setting.panelPartsOffset};
          }
        }
      },
      select: {
        key: 8,
        listener: (event, range, pai, callback) => {
          let mousePos = this.fixPoint(event);
          if(this.buttonCollision(mousePos, range)) {
            callback(pai);
            this.init();
          }
        }
      }
    };
  }

  createHandler() {
    let events = {};
    return {
      addListener: (target, type, listener, capture, key) => {
        target.addEventListener(type, listener, capture);
        events[key] = {
          target: target,
          type: type,
          listener: listener,
          capture: capture
        };
      },
      removeListener: key => {
        if(key === undefined) {
          for(let eKey in events) {
            let e = events[eKey];
            e.target.removeEventListener(e.type, e.listener, e.capture);
            delete events[eKey];
          }
        }else {
          if(key in events) {
            let e = events[key];
            e.target.removeEventListener(e.type, e.listener, e.capture);
            delete events[key];
          }
        }
      },
      getKeyNumber: key => {
        if(key in events) {
          return key;
        }
      },
      getMaxKeyNumber: () => {
        let maxNumber = 0;
        for(let key in events) {
          maxNumber = maxNumber < key ? key : maxNumber;
        }
        return maxNumber;
      }
    };
  }

  //panelの初期化
  init() {
    this.handler.removeListener();
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.operate = false;
    this.buttonState = {num: 0, x: 0, y: Setting.panelPartsOffset};
  }

  //クリック時の座標を特定
  fixPoint(event) {
    let rect = this.canvas.getBoundingClientRect();
    return {x: event.pageX - rect.left, y: event.pageY - rect.top};
  }

  //クリック位置とボタンとの当たり判定。当たっていたら->true、当たっていなかったら->false
  buttonCollision(mousePos, range) {
    if(  mousePos.x >= range.left
      && mousePos.x <= range.right
      && mousePos.y >= range.top
      && mousePos.y <= range.bottom)
    {
      //console.log("mx = " + mousePos.x, "my = " + mousePos.y);
      return true;
    }else
    {
      return false;
    }
  }

  createButton(buttonType, callback) {
    this.operate = true;
    //buttonTypeのボタンを生成
    this.buttonState.x = Setting.panelButtonWidth * this.buttonState.num + Setting.panelPartsOffset * (this.buttonState.num + 1);
    this.context.fillStyle = "silver";
    let range = {
      left: this.buttonState.x,
      top: this.buttonState.y,
      right: this.buttonState.x + Setting.panelButtonWidth,
      bottom: this.buttonState.y + Setting.panelButtonHeight
    };
    this.context.fillRect(this.buttonState.x, this.buttonState.y, Setting.panelButtonWidth, Setting.panelButtonHeight);
    this.context.fillStyle = "black";
    if(buttonType.key == 0) {
      this.context.font = Setting.panelCancelButtonFont;
    }else {
      this.context.font = Setting.panelButtonFont;
    }
    this.context.textAlign = "center";
    let fx = this.buttonState.x + Setting.panelButtonWidth / 2;
    let fy = (this.buttonState.y + Setting.panelButtonHeight) - Setting.panelButtonFontOffset;
    this.context.fillText(buttonType.value, fx, fy);
    this.handler.addListener(this.canvas,
                            'click',
                             event => {
                               buttonType.listener(event, range, callback);
                             },
                             false,
                             buttonType.key);
    this.buttonState.num++;
  }

  //副露可能時、副露できる組み合わせ一覧をクリックで選択できる項目を生成
  createFuroSelect(furoAblePai, callback) {
    //let selectX;                  //セレクト項目の描画位置x
    //let selectY;                  //セレクト項目の描画位置y
    let paiX;                     //セレクト項目の牌の描画位置x
    let paiY;                     //セレクト項目の牌の描画位置y
    for(let i = 0; i < furoAblePai.length; i++) {
      let range = {
        left: Setting.panelFuroWidth * i + Setting.panelPartsOffset * (i + 1),
        top: Setting.panelPartsOffset * 2 + Setting.panelButtonHeight,
        right: Setting.panelFuroWidth * i + Setting.panelPartsOffset * (i + 1) + Setting.panelFuroWidth,
        bottom: Setting.panelPartsOffset * 2 + Setting.panelButtonHeight + Setting.panelFuroHeight
      };
      //selectX = Setting.panelFuroWidth * i + Setting.panelPartsOffset * (i + 1);
      //selectY = Setting.panelPartsOffset * 2 + Setting.panelButtonHeight;
      //セレクト項目の描画
      this.context.fillStyle = "silver";
      this.context.fillRect(range.left, range.top, Setting.panelFuroWidth, Setting.panelFuroHeight);
      const pai = furoAblePai[i];
      //console.log("furoAblePai = " + pai);
      //console.log(pai.length);
      if(pai.length == 1) {             //ポン
        for(let j = 0; j < 2; j++) {
          paiX = Setting.panelFuroPaiWidth * j + Setting.panelFuroPaiOffset * (j + 1) + range.left;
          paiY = Setting.panelFuroPaiOffset + range.top;
          this.drawPai(pai[0], paiX, paiY, Setting.panelFuroPaiWidth, Setting.panelFuroPaiHeight);
        }
      }else if(pai.length == 2) {       //チー
        for(let j = 0; j < pai.length; j++) {
          paiX = Setting.panelFuroPaiWidth * j + Setting.panelFuroPaiOffset * (j + 1) + range.left;
          paiY = Setting.panelFuroPaiOffset + range.top;
          this.drawPai(pai[j], paiX, paiY, Setting.panelFuroPaiWidth, Setting.panelFuroPaiHeight);
        }
      }else if(pai.length == 3) {       //明槓
        for(let j = 0; j < pai.length; j++) {
          paiX = 22 * j + 7.5 * (j + 1) + range.left;
          paiY = 17.5 + range.top;
          this.drawPai(pai[j], paiX, paiY, 22, 30);
        }
      }else if(pai.length == 4) {       //暗槓
        paiX = (Setting.panelFuroWidth - Setting.panelFuroPaiWidth) / 2 + range.left;
        paiY = Setting.panelFuroPaiOffset + range.top;
        this.drawPai(pai[0], paiX, paiY, Setting.panelFuroPaiWidth, Setting.panelFuroPaiHeight);
      }
      //クリックイベントの追加
      this.handler.addListener(this.canvas,
                              'click',
                               event => {
                                 this.buttonType.select.listener(event, range, pai, callback);
                               },
                               false,
                               this.buttonType.select.key + i);
    }
  }

  //ボタンを押したときの処理
  pressButton(event, range, callback) {
    let mousePos = this.fixPoint(event);
    if(this.buttonCollision(mousePos, range)) {
      let clearY = Setting.panelPartsOffset * 2 + Setting.panelButtonHeight;
      this.context.clearRect(0, clearY, this.canvas.width, this.canvas.height - clearY);
      for(let i = this.buttonType.select.key; i <= this.handler.getMaxKeyNumber(); i++) {
        this.handler.removeListener(i);
      }
      callback();
    }
  }

  //1牌を描画
  drawPai(index, x, y, width, height) {
    const iw = Setting.paiImageWidth;
    const ih = Setting.paiImageHeight;
    const ix = (index % 10) * iw;                     //indexからx軸の位置を計算
    const iy = Math.floor(index / 10) * ih;           //indexからy軸の位置を計算
    this.context.drawImage(this.assets.pai, ix, iy, iw, ih, x, y, width, height);
  }
}
