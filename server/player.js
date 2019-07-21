module.exports = class Player
{
  constructor(name) {
    this.name = name;                        //自身の名前
    this.listIndex;                          //worldクラスのplayerListのインデックス番号
    this.turn;                               //自身の現在のターン（自風）。東->0、南->1、西->2、北->3
    this.tehai = [];                         //手牌
    this.tumoFlag = false;                   //自摸牌を持っているかの判定
    this.rinshanFlag = false;                //自摸牌が嶺上牌かの判定
    this.furo = [];                          //副露牌
    this.sutehai = [];                       //捨て牌
    this.point = 25000;                      //持ち点
    this.shantenCount = 8;                   //シャン点数
    this.lizhi = {flag: false, num: null, ippatsu: false};   //何巡目でリーチしたか, 一発かどうか
  }

  //初期化
  init() {
    this.listIndex = null;
    this.turn = null;
    this.tehai = [];
    this.tumoFlag = false;
    this.rinshanFlag = false;
    this.furo = [];
    this.sutehai = [];
    this.point = 25000;
    this.shantenCount = 8;
    this.lizhi = {flag: false, num: null, ippatsu: false};
  }

  //手牌の並び替え
  tehaiSort() {
    this.tehai.sort((a, b) => a - b);
  }

  //手牌から一枚捨てる
  discard(point) {
    let paiType = this.tehai[point];
    this.sutehai.push(this.tehai[point]);
    this.tehai.splice(point, 1);
    this.tumoFlag = false;
    this.rinshanFlag = false;
    return paiType;
  }

  //鳴く
  doFuro(discardPai, furoAblePai, discardPlayer) {
    let diff = discardPlayer - this.turn;   //自身と鳴かせたプレイヤーとの席位置の差
    diff = diff < 0 ? 4 + diff : diff;
    diff = Math.abs(diff - 3);
    let furo = {};                          //副露牌を表すオブジェクト {type: , pai: [], point: }
    if(furoAblePai.length == 3) {           //明槓
      for(let x = 0; x < furoAblePai.length; x++) {
        this.tehai.some((value, index, array) => {
          if(value == furoAblePai[x]) {
            array.splice(index, 1);
            return true;
          }
        });
      }
      furo.type = "minkan";
      let rPai = furoAblePai.concat();
      rPai.splice(0, 0, discardPai);
      furo.pai = rPai;
      if(diff == 2) {
        diff++;
        furo.point = diff
      }else {
        furo.point = diff;
      }
    }else if(furoAblePai.length == 2) {     //順子
      for(let x = 0; x < furoAblePai.length; x++) {
        this.tehai.some((value, index, array) => {
          if(value == furoAblePai[x]) {
            array.splice(index, 1);
            return true;
          }
        });
      }
      furo.type = "shuntsu";
      let rPai = furoAblePai.concat();
      rPai.splice(0, 0, discardPai);
      furo.pai = rPai;
      furo.point = 0;
    }else if(furoAblePai.length == 1) {     //刻子
      for(let x = 0; x < 2; x++) {
        this.tehai.some((value, index, array) => {
          if(value == discardPai) {
            array.splice(index, 1);
            return true;
          }
        });
      }
      furo.type = "kotsu";
      let rPai = [discardPai, discardPai, discardPai];
      furo.pai = rPai;
      furo.point = diff;
    }
    this.furo.push(furo);

    return furo;
  }

  //暗槓
  doAnkan(kantsu) {
    this.tehai = this.tehai.filter(value => {
      return value !== kantsu[0];
    });
    this.tehaiSort();
    let furo = {};
    furo.type = "ankan";
    furo.pai = kantsu.concat();
    furo.point = null;
    this.furo.push(furo);
  }

  //加カン
  doKakan(kakan) {
    let paiType = kakan[0];             //牌種
    //加カンする刻子の副露牌を加カンに
    //加カンの牌表現は刻子のtypeをkakanに変えるだけ（paiの中身は変わらない）
    this.furo.some(value => {
      if(value.type == "kotsu" && value.pai[0] == paiType) {
        value.type = "kakan";
        return true;
      }
    });
    //手牌から加カンした牌を削除
    this.tehai = this.tehai.filter(value => {
      return value != paiType;
    });
    this.tehaiSort();
  }

  //局が進んだ時の処理
  kyokuProceed(proceed) {           //proceedがtrueならturnが進むfalseならturnはそのまま
    if(proceed) {
      this.turn = (this.turn + 1) % 4;
    }
    this.tehai = [];                         //手牌
    this.tumoFlag = false;                   //自摸牌を持っているかの判定
    this.rinshanFlag = false;                //自摸牌が嶺上牌かの判定
    this.furo = [];                          //副露牌
    this.sutehai = [];                       //捨て牌
    this.shantenCount = 8;                   //シャン点数
    this.lizhi = {flag: false, num: null, ippatsu: false};   //何巡目でリーチしたか, 一発かどうか
  }
}
