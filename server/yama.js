module.exports = class Yama
{
  constructor() {
    this.self = [];
    this.pileUp(this.self);
    this.current = 0;
    this.haitei = 121;
    this.wanpai;
    this.doraHyo;
    this.dora;
    this.uraDoraHyo;
    this.uraDora;
    this.rinshan;
  }

  //山を積む処理
  pileUp(yama) {
    for(let x = 0; x <= 36; x++) {
      if(x == 9 || x == 19 || x == 29) {
        continue;
      }
      for(let y = 1; y <= 4; y++) {
        yama.push(x);
      }
    }
    //山をシャッフル
    this.shuffle(yama);
  }

  //山を混ぜる
  shuffle(yama) {
    for(let i = yama.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [yama[i], yama[j]] = [yama[j], yama[i]];
    }
    //ワン牌を作成
    this.wanpai = yama.filter((value, index) => {
      return index >= 122;
    });
    //ドラ表示牌を作成
    this.doraHyo = this.wanpai.filter((value, index) => {
      return index % 2 == 0 && index >= 4;
    });
    this.doraHyo.push(0);               //現在表示できるドラの数を配列の末尾に入れる。0->1つ表示、1->2つ表示...
    //裏ドラ表示牌を作成
    this.uraDoraHyo = this.wanpai.filter((value, index) => {
      return index % 2 == 1 && index >= 4;
    });
    this.uraDoraHyo.push(0);               //現在表示できるドラの数を配列の末尾に入れる。0->1つ表示、1->2つ表示...
    this.createDora();                     //ドラの作成
    //嶺上牌を作成
    this.rinshan = this.wanpai.filter((value, index) => {
      return index < 4;
    });
  }

  //ドラ作成
  createDora() {
    //初期化
    this.dora = [];
    this.uraDora = [];
    for(let i = 0; i <= this.doraHyo[this.doraHyo.length - 1]; i++) {
      //ドラ
      if(this.doraHyo[i] % 10 == 8 && this.doraHyo[i] < 29) {
        this.dora.push(this.doraHyo[i] - 8);
      }else if(this.doraHyo[i] == 33) {
        this.dora.push(this.doraHyo[i] - 3);
      }else if(this.doraHyo[i] == 36) {
        this.dora.push(this.doraHyo[i] - 2);
      }else {
        this.dora.push(this.doraHyo[i] + 1);
      }
      //裏ドラ
      if(this.uraDoraHyo[i] % 10 == 8 && this.uraDoraHyo[i] < 29) {
        this.uraDora.push(this.uraDoraHyo[i] - 8);
      }else if(this.uraDoraHyo[i] == 33) {
        this.uraDora.push(this.uraDoraHyo[i] - 3);
      }else if(this.uraDoraHyo[i] == 36) {
        this.uraDora.push(this.uraDoraHyo[i] - 2);
      }else {
        this.uraDora.push(this.uraDoraHyo[i] + 1);
      }
    }
  }
}
