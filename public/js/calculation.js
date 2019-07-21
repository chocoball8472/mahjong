class Calculation
{
  constructor() {
    this.tehai = [
      0,0,0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0
    ];
    this.tempTehai;
    //シャン点数計算用変数
    this.shantenCount;                  //シャン点数
    this.tempShantenCount = 0;          //シャン点数（計算用の）
    this.shantenNormal = 0;             //シャン点数（通常）
    this.shantenKokushi = 0;            //シャン点数（国士無双）
    this.shantenChitoitsu = 0;          //シャン点数（七対子)
    this.toitsuCount = 0;               //トイツ数
    this.mentsuCount = 0;               //面子数
    this.tatsuCount = 0;                //ターツ数
    //副露チェック用変数
    this.furoAblePai = [];              //副露可能な牌種を格納
    //上がり牌チェック用変数
    this.agarihai = [];                 //上がり牌を格納する変数
    //フリテンチェック用変数
    this.furiten = false;               //上がり牌見逃しフリテンか確認する変数
    //不要牌チェック用変数
    this.fuyohai = [];                  //不要牌を格納する変数
    //点数計算用変数
    this.mentsuType = ["pon", "anko", "chi", "shuntsu", "minkan", "ankan", "toitsu"];     //面子の種類
    this.mentsu = [];                   //面子の結果格納用
    this.tempMentsu = [];               //計算時に切り分けた面子を格納   面子は{pai: , type: }のオブジェクトで表現
    this.pointer = 0;                   //mentsuの現在地を示す
    this.ron = false;                   //ロンかツモか判定　ロン->true、ツモ->false
    this.atarihai;                      //実際に上がった牌
    this.menzen = true;                 //面前かの判定
    this.haitei = false;                //海底かの判定
    this.lizhiState;                    //playerのlizhiをコピー
    this.tenhoFlag = false;             //順目が１だったときtrue
    this.rinshanFlag = false;           //嶺上開花かの判定
    this.bakaze;                        //場風
    this.zikaze;                        //自風
    this.dora = [];                     //ドラ
    this.uraDora = [];                  //裏ドラ
    this.han = 0;                       //ハン数
    this.tempHan = 0;                   //計算用ハン数
    this.yakuName = [];                 //上がった役の名前を格納
    this.tempYakuName = [];             //上がった役の名前を格納（計算用）
    this.yaku = {                       //役一覧
      tyuren: {flag: false, han: 13, value: "九蓮宝燈", method: () => {return this.tyuren()}},
      chinroto: {flag: false, han: 13, value: "清老頭", method: () => {return this.chinroto()}},
      ryuiso: {flag: false, han: 13, value: "緑一色", method: () => {return this.ryuiso()}},
      daisushi: {flag: false, han: 13, value: "大四喜和", method: () => {return this.daisushi()}},
      suanko: {falg: false, han: 13, value: "四暗刻", method: () => {return this.suanko()}},
      sukantsu: {flag: false, han: 13, value: "四槓子", method: () => {return this.sukantsu()}},
      tsuiso: {flag: false, han: 13, value: "字一色", method: () => {return this.tsuiso()}},
      shosushi: {flag: false, han: 13, value: "小四喜和", method: () => {return this.shosushi()}},
      daisangen: {flag: false, han: 13, value: "大三元", method: () => {return this.daisangen()}},
      tenho: {flag: false, han: 13, value: "天和", method: () => {return this.tenho()}},
      chiho: {flag: false, han: 13, value: "地和", method: () => {return this.chiho()}},
      kokushimuso: {flag: false, han: 13, value: "国士無双", method: () => {return true;}},
      chinitsu: {flag: false, han: 6, value: "清一色", method: () => {return this.chinitsu()}},
      honitsu: {flag: false, han: 3, value: "混一色", method: () => {return this.honitsu()}},
      jyunchanta: {flag: false, han: 3, value: "純チャンタ", method: () => {return this.jyunChanta()}},
      ryanpeko: {flag: false, han: 3, value: "二盃口", method: () => {return this.ryanpeko()}},
      sanshokuDozyun: {flag: false, han: 2, value: "三色同順", method: () => {return this.sanshokuDozyun()}},
      ikkitsukan: {flag: false, han: 2, value: "一気通貫", method: () => {return this.ikkitsukan()}},
      chanta: {flag: false, han: 2, value: "チャンタ", method: () => {return this.chanta()}},
      chitoitsu: {flag: false, han: 2, value: "七対子", method: () => {return true;}},
      toitoi: {flag: false, han: 2, value: "対々和", method: () => {return this.toitoi()}},
      sananko: {flag: false, han: 2, value: "三暗刻", method: () => {return this.sananko()}},
      honroto: {flag: false, han: 2, value: "混老頭", method: () => {return this.honroto()}},
      sanshokuDoko: {flag: false, han: 2, value: "三色同刻", method: () => {return this.sanshokuDoko()}},
      sankantsu: {flag: false, han: 2, value: "三槓子", method: () => {return this.sankantsu()}},
      shosangen: {flag: false, han: 2, value: "小三元", method: () => {return this.shosangen()}},
      doublelizhi: {flag: false, han: 2, value: "ダブル立直", method: () => {return this.doublelizhi()}},
      lizhi: {flag: false, han: 1, value: "立直", method: () => {return this.lizhi()}},
      ippatsu: {flag: false, han: 1, value: "一発", method: () => {return this.ippatsu()}},
      menzentumo: {flag: false, han: 1, value: "門前清自摸和", method: () => {return this.menzentumo()}},
      tanyao: {flag: false, han: 1, value: "タンヤオ", method: () => {return this.tanyao()}},
      pinfu: {flag: false, han: 1, value: "平和", method: () => {return this.pinfu()}},
      ipeko: {flag: false, han: 1, value: "一盃口", method: () => {return this.ipeko()}},
      rinshankaiho: {flag: false, han: 1, value: "嶺上開花", method: () => {return this.rinshankaiho()}},
      chankan: {flag: false, han: 1, value: "槍槓", method: () => {return this.chankan()}},
      haitei: {flag: false, han: 1, value: "海底", method: () => {return this.haitei()}},
      hotei: {flag: false, han: 1, value: "河底", method: () => {return this.hotei()}},
      yakuhai: {flag: false, han: 0, value: "役牌", method: () => {
                    let type = [34, 35, 36, this.zikaze, this.bakaze];
                    this.yaku.yakuhai.han = 0;
                    for(let value of type) {
                      if(this.yakuhai(value)) {
                        this.yaku.yakuhai.han++;
                      }
                    }
                    if(this.yaku.yakuhai.han > 0) {
                      this.yaku.yakuhai.value = "役牌 " + this.yaku.yakuhai.han;
                      return true;
                    }
                    return false;
                  }
                }
    };
    this.fu = 0;                            //符
    this.tempFu = 0;                        //計算用の符
    this.point = 0;                         //点数の結果
    this.tempPoint = 0;                     //計算用の点数
    this.tempPoint;                         //計算用点数
    this.pTableChild = [                    //子の点数早見表（縦が符、横がハン）
      [0, 1400, 2600, 5200],
      [0, 1600, 3200, 6400],
      [1000, 2000, 3900, 8000],
      [1300, 2600, 5200, 8000],
      [1600, 3200, 6400, 8000],
      [2000, 3900, 8000, 8000],
      [2300, 4500, 8000, 8000],
      [2600, 5200, 8000, 8000],
      [2900, 5800, 8000, 8000],
      [3200, 6200, 8000, 8000],
      [3600, 7100, 8000, 8000]
    ];
    this.pTableParent = [               //親の点数早見表（縦が符、横がハン）
      [0, 2100, 3900, 7800],
      [0, 2400, 4800, 9600],
      [1500, 2900, 5800, 12000],
      [2000, 3900, 7700, 12000],
      [2400, 4800, 9600, 12000],
      [2900, 5800, 12000, 12000],
      [3400, 6800, 12000, 12000],
      [3900, 7700, 12000, 12000],
      [4400, 8700, 12000, 12000],
      [4800, 9600, 12000, 12000],
      [5300, 10600, 12000, 12000]
    ];
  }

  //Playerクラスの手牌をCalculationクラスの手牌に変換
  convert(playerTehai) {
    //初期化
    this.tehai = [
      0,0,0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0
    ];
    for(let x = 0; x < playerTehai.length; x++) {
      this.tehai[playerTehai[x]]++;
    }
  }

  //副露牌と手牌を統合
  integrate(tehai, furo) {
    furo.forEach(value => {
      if(value.type == "kotsu") {
        tehai[value.pai[0]] += 3;
      }else if(value.type == "ankan" || value.type == "minkan" || value.type == "kakan") {
        tehai[value.pai[0]] += 4;
      }else if(value.type == "shuntsu") {
        value.pai.forEach(pai => {
          tehai[pai]++;
        });
      }
    });
  }

  //シャン点数の計算開始
  startShantenCount(playerTehai, playerFuro) {
    //Playerクラスの手牌をCalculationクラスの手牌に変換
    this.convert(playerTehai);

    //国士無双、七対子、通常種のシャン点数を計算し比較
    let shantenKokushi = this.shantenKokushiCount();
    let shantenChitoitsu = this.shantenChitoitsuCount();
    this.shantenCount = shantenKokushi > shantenChitoitsu ? shantenChitoitsu : shantenKokushi;
    let shantenNormal = this.shantenNormalCount(playerFuro);
    this.shantenCount = this.shantenCount > shantenNormal ? shantenNormal : this.shantenCount;

    //console.log("国士無双 = " + shantenKokushi, "七対子 = " + shantenChitoitsu, "通常手 = " + shantenNormal);

    return this.shantenCount;
  }

  //国士無双のシャン点数を計算
  shantenKokushiCount() {
    //初期化
    this.shantenKokushi = 13;
    let kokushiToitsu = 0;

    //一、九牌
    for(let i = 0; i < 30; i++) {
      if(i % 10 == 0 || i % 10 == 8) {
        if(this.tehai[i]) {
          this.shantenKokushi--;
        }
        //対子が見つかったら　－１
        if(this.tehai[i] >= 2 && kokushiToitsu == 0) {
          this.shantenKokushi--;
          kokushiToitsu++;
        }
      }
    }

    //字牌
    for(let i = 30; i < 37; i++) {
      if(this.tehai[i]) {
        this.shantenKokushi--;
      }
      if(this.tehai[i] >= 2 && kokushiToitsu == 0) {
        this.shantenKokushi--;
        kokushiToitsu++;
      }
    }

    return this.shantenKokushi;
  }

  //七対子のシャン点数計算
  shantenChitoitsuCount() {
    //初期化
    this.shantenChitoitsu = 6;
    let type = 0;

    for(let i = 0; i < 37; i++) {
      if(!this.tehai[i]) {
        continue;
      }
      type++;
      if(this.tehai[i] >= 2) {
        this.shantenChitoitsu--;
      }
    }

    //４枚もちを考慮（手牌の牌種が７枚以下だった場合）
    if(type < 7) {
      this.shantenChitoitsu += 7 - type;
    }

    return this.shantenChitoitsu;
  }

  //通常種のシャン点数計算
  shantenNormalCount(playerFuro) {
    //Playerクラスの手牌をCalculationクラスの手牌に変換
    //this.convert(playerTehai);

    //初期化
    this.shantenNormal = 8;
    this.tempShantenCount = 0;
    this.toitsuCount = 0;
    this.mentsuCount = 0;
    this.tatsuCount = 0;

    //副露牌があったら副露の数だけmentsuCountに＋１
    if(playerFuro.length > 0) {
      this.mentsuCount = playerFuro.length;
      if(this.mentsuCount == 4) {
        this.shantenNormal = 0;
        return this.shantenNormal;
      }
    }

    //手牌の配列のコピー
    //this.tempTehai = this.tehai.concat();

    //頭を抜き出すと仮定して計算
    for(let i = 0; i < 37; i++) {
      if(this.tehai[i] >= 2) {
        this.toitsuCount++;
        this.tehai[i] -= 2;
        this.mentsuCut(0);
        this.tehai[i] += 2;
        this.toitsuCount--;
      }
    }

    //頭を抜き出さないと仮定して計算
    this.mentsuCut(0);

    return this.shantenNormal;
  }

  //面子を抜き出す
  mentsuCut(index) {
    //indexの牌種が０枚だったら次の牌種へ
    while(!this.tehai[index]) {
      //面子が抜き終わったらターツ抜きへ
      if(index >= 37) {
        this.tatsuCut(0);
        return;
      }
      index++;
    }

    //刻子抜き
    if(this.tehai[index] >= 3) {
      this.mentsuCount++;
      this.tehai[index] -= 3;
      this.mentsuCut(index);
      this.tehai[index] += 3;
      this.mentsuCount--;
    }

    //順子抜き
    if(this.tehai[index + 1] && this.tehai[index + 2] && index < 30) {
      this.mentsuCount++;
      this.tehai[index]--;
      this.tehai[index + 1]--;
      this.tehai[index + 2]--;
      this.mentsuCut(index);
      this.tehai[index]++;
      this.tehai[index + 1]++;
      this.tehai[index + 2]++;
      this.mentsuCount--;
    }

    //面子無しと仮定
    this.mentsuCut(index + 1);
  }

  //ターツを抜き出す
  tatsuCut(index) {
    //indexの牌種が０枚だったら次の牌種へ
    while(!this.tehai[index]) {
      //ターツの抜き出しが終了したらシャン点数を計算
      if(index >= 37) {
        this.tempShantenCount = 8 - this.mentsuCount * 2 - this.tatsuCount - this.toitsuCount;
        if(this.shantenNormal > this.tempShantenCount) {
          this.shantenNormal = this.tempShantenCount;
        }
        //console.log(this.mentsuCount, this.tatsuCount, this.toitsuCount);
        return;
      }
      index++;
    }

    //ターツ抜き出し
    if(this.mentsuCount + this.tatsuCount < 4) {
      //トイツ
      if(this.tehai[index] == 2) {
        this.tatsuCount++;
        this.tehai[index] -= 2;
        this.tatsuCut(index);
        this.tehai[index] += 2;
        this.tatsuCount--;
      }

      //ペンチャン、両面
      if(this.tehai[index + 1] && index < 30) {
        this.tatsuCount++;
        this.tehai[index]--;
        this.tehai[index + 1]--;
        this.tatsuCut(index);
        this.tehai[index + 1]++;
        this.tehai[index]++;
        this.tatsuCount--;
      }

      //カンチャン
      if(this.tehai[index + 2] && index < 30 && index % 10 < 8) {
        this.tatsuCount++;
        this.tehai[index]--;
        this.tehai[index + 2]--;
        this.tatsuCut(index);
        this.tehai[index + 2]++;
        this.tehai[index]++;
        this.tatsuCount--;
      }
    }

    //次の牌種に処理を進める
    this.tatsuCut(index + 1);
  }

  //上がり牌を調べる（牌を捨てた後に行う）
  agarihaiSearch(playerTehai, playerFuro) {
    //初期化
    this.agarihai = [];
    let agari = [];               //上がり牌を格納する配列

    //シャン点数の確認
    this.startShantenCount(playerTehai, playerFuro);

    if(this.shantenNormal == 0)         //通常手がテンパイの時
    {
      agari = this.agariNormal(playerFuro);
    }
    else if(this.shantenChitoitsu == 0 && this.shantenNormal > 0)    //七対子テンパイで通常手がテンパイでないとき
    {
      agari = this.agarichitoitsu();
    }
    else if(this.shantenKoukshi == 0)   //国士無双テンパイの時
    {
      agari = this.agariKokushi();
    }

    if(agari.length > 0) {
      this.agarihai = agari.concat();
      return this.agarihai;
    }
  }

  //孤立牌でない牌を調べる
  notKorituCheck() {
    //初期化
    let temp = [                    //計算用配列
      0,0,0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0
    ];
    let notKoritu = [];             //孤立牌でない牌種を格納する配列
    //計算
    for(let i = 0; i < 37; i++) {
      if(!this.tehai[i]) {
        continue;
      }
      //数牌
      if(i < 30) {
        if(i % 10 == 0) {
          temp[i] = temp[i + 1] = 1;
        }else if(i % 10 >= 1 && i % 10 <= 7) {
          temp[i - 1] = temp[i] = temp[i + 1] = 1;
        }else if(i % 10 == 8) {
          temp[i - 1] = temp[i] = 1;
        }
      }
      //字牌
      if(i >= 30) {
        temp[i] = 1;
      }
    }
    //結果を格納
    for(let i = 0; i < 37; i++) {
      if(!temp[i]) {
        continue;
      }
      notKoritu.push(i);
    }
    return notKoritu;
  }

  //通常手の上がり牌
  agariNormal(playerFuro) {
    //初期化
    let agariNormal = [];
    let notKoritu = this.notKorituCheck();
    let shantenNormal = this.shantenNormal;
    //計算
    for(let i = 0; i < notKoritu.length; i++) {
      //否孤立牌を追加
      this.tehai[notKoritu[i]]++;
      //現在のシャン点数と比較
      if(this.shantenNormalCount(playerFuro) < shantenNormal) {
        agariNormal.push(notKoritu[i]);
      }
      //追加した否孤立牌をマイナス
      this.tehai[notKoritu[i]]--;
    }

    return agariNormal;
  }

  //七対子の上がり牌（テンパイ時のみ調べる）
  agariChitoitsu() {
    let agariChitoitsu = [];
    for(let i = 0; i < 37; i++) {
      if(this.tehai[i] == 1) {
        agariChitoitsu.push(i);
      }
    }
    return agariChitoitsu;
  }

  //国士無双の上がり牌（テンパイ時のみ調べる）
  agariKokushi() {
    let agariKokushi = [];
    let kokushihai = [0, 8, 10, 18, 20, 28, 30, 31, 32, 32, 34, 35, 36];
    for(let i = 0; i < kokushihai.length; i++) {
      if(!this.tehai[kokushihai[i]]) {
        agariKokushi.push(kokushihai[i]);
      }
    }
    if(agariKokushi.length < 0) {
      agariKokushi = kokushihai.concat();
    }

    return agariKokushi;
  }

  //テンパイ時に上がり牌かチェックする
  agariCheck(pai) {
    return this.agarihai.some(value => {
      return value == pai;
    });
  }

  //フリテンか調べる
  furitenCheck(sutehai) {
    //捨て牌の中に上がり牌があったらフリテン
    for(let i = 0; i < sutehai.length; i++) {
      for(let j = 0; j < this.agarihai.length; j++) {
        if(sutehai[i] == this.agarihai[j]) {
          return false;
        }
      }
    }
    //上がり牌を見逃していたらフリテン
    if(this.furiten) {
      return false;
    }
    return true;
  }

  //不要牌を探す
  fuyohaiSearch(tehai, furo) {
    this.fuyohai = [];          //初期化
    let cNormal = this.shantenNormal, cChitoitsu = this.shantenChitoistu, cKokushi = this.shantenKokushi;   //現在のシャン点数を避難
    let currentShanten = this.shantenCount;       //現在のシャン点数
    let temp = tehai.concat();                    //計算用手牌に手牌をコピー
    for(let i = 0; i < tehai.length; i++) {
      temp.splice(i, 1);                //1牌抜く
      let afterShanten = this.startShantenCount(temp, furo);      //１牌抜いた手牌のシャン点数計算
      if(afterShanten == currentShanten) {                        //シャン点数が変わらければ不要牌
        this.fuyohai.push({point: i, type: tehai[i]});            //不要牌は{point(手牌の場所): , type(牌種): }で表現
      }
      temp = tehai.concat();
    }
    //現在のシャン点数に戻す
    this.shantenCount = currentShanten;
    this.shantenNormal = cNormal, this.shantenChitoitsu = cChitoitsu, this.shantenKokushi = cKokushi;
    //console.log(this.fuyohai);
  }

  //副露可能な牌を返す
  furoCheck(player, discardPai, discardPlayer) {
    //Playerクラスの手牌をCalculationクラスの手牌に変換
    this.convert(player.tehai);

    //初期化
    this.furoAblePai = [];

    //刻子
    if(this.tehai[discardPai] >= 2) {
      this.furoAblePai.push([discardPai]);
    }
    //カン
    if(this.tehai[discardPai] >= 3) {
      this.furoAblePai.push([discardPai, discardPai, discardPai]);
    }
    //順子
    let diff = discardPlayer.turn - player.turn;
    diff = diff < 0 ? 4 + diff : diff;
    if(diff == 3) {
      //ペンチャン、両面
      if(this.tehai[discardPai - 2] && this.tehai[discardPai - 1] && discardPai < 30 && discardPai % 10 > 1) {
        this.furoAblePai.push([discardPai - 2, discardPai - 1]);
      }
      if(this.tehai[discardPai + 1] && this.tehai[discardPai + 2] && discardPai < 30 && discardPai % 10 < 7) {
        this.furoAblePai.push([discardPai + 1, discardPai + 2]);
      }
      //カンチャン
      if(this.tehai[discardPai - 1] && this.tehai[discardPai + 1] && discardPai < 30 && discardPai % 10 < 8) {
        this.furoAblePai.push([discardPai - 1, discardPai + 1]);
      }
    }

    return this.furoAblePai;
  }

  //暗槓ができるか調べる
  ankanCheck() {
    let kantsu = [];
    for(let i = 0; i < 37; i++) {
      if(this.tehai[i] == 4) {
        kantsu.push([i, i, i, i]);
      }
    }
    return kantsu;
  }

  //立直後に暗槓できるか調べる
  ankanCheckAfterLizhi(tehai, tumohai) {
    this.tempTehai = this.tehai.concat();   //手牌の避難
    let flag = true;                        //kantsuを返すか判定する真偽値
    let currentAgarihai = this.agarihai.concat();   //現在の上がり牌
    let tempTehai, kantsu = [];                     //槓子を抜いた手牌、槓子
    if(this.tehai[tumohai] >= 3) {                  //手牌の中に自摸牌が3枚あったらカン可能
      tempTehai = tehai.filter(value => {           //カン可能牌を手牌から抜く
        return value != tumohai;
      });
      kantsu.push([tumohai, tumohai, tumohai, tumohai]);    //槓子作成
    }
    else {                                          //カンできなかったらfalse
      flag = false;
    }
    if(flag) {            //カン可能牌があったら
      let afterAgarihai = this.agarihaiSearch(tempTehai, kantsu);     //カンした後の上がり牌
      //現在の上がり牌とカン後の上がり牌が変わらなければtrue
      flag = this.arrayEqual(currentAgarihai, afterAgarihai);
    }
    //手牌と上がり牌を元に戻す
    this.tehai = this.tempTehai.concat();
    this.agarihai = currentAgarihai.concat();
    if(flag) {
      return kantsu;
    }else {
      return [];
    }
  }

  //配列を比較するメソッド
  arrayEqual(arrayA, arrayB) {
    if(!array.isArray(arrayA)) {return false;}
    if(!array.isArray(arrayB)) {return false;}
    if(arrayA.length != arrayB.length) {return false;}
    for(let i = 0; i < arrayA.length; i++) {
      if(arrayA[i] !== arrayB[i]) {return false;}
    }
    return true;
  }

  //加カンできるかチェック
  kakanCheck(furo, tehai) {
    let kakan = [];
    for(let i = 0; i < furo.length; i++) {
      let f = furo[i];
      for(let j = 0; j < tehai.length; j++) {
        if(f.type == "kotsu" && f.pai[0] == tehai[j]) {
          kakan.push([tehai[j], tehai[j], tehai[j], tehai[j]]);
        }
      }
    }
    return kakan;
  }

  //点数計算
  //面子の切り分けを始める
  startPoint(player, atarihai, state) {
    //初期化
    this.han = 0;
    this.point = 0;
    this.pointer = 0;
    this.menzen = true;
    this.tenhoFlag = false;
    this.convert(player.tehai);
    //手牌を保存
    this.tempTehai = this.tehai.concat();
    //当たり牌をメンバ変数に代入
    this.atarihai = atarihai;
    if(this.ron) {this.tehai[atarihai]++;}

    //その他の変数に値を格納
    if(player.sutehai.length == 0) {
      this.tenhoFlag = true;
    }
    this.lizhiState = player.lizhi;
    this.haitei = state.haitei;
    this.rinshanFlag = player.rinshanFlag;
    this.bakaze = state.bakaze + 30;
    this.zikaze = player.turn + 30;

    //手牌と副露牌を統合
    this.intTehai = this.tehai.concat();
    this.integrate(this.intTehai, player.furo);

    //面前か確認
    if(player.furo.length > 0) {
      let count = 0;
      for(let i = 0; i < player.furo.length; i++) {
        if(player.furo[i].type == "ankan") {
          continue;
        }else {
          count++;
        }
      }
      if(count) {
        this.menzen = false;
      }
    }

    //通常手、七対子、国士無双の場合で分ける
    if(this.shantenKokushi <= 0) {          //国士無双
      this.yakuJudge("koukshimuso");
      this.han += 13;
      this.yakuName = [this.yaku.kokushimuso.value];
      if(this.zikaze == 30) {        //親
        this.point = 32000;
      }else {                       //子
        this.point = 48000;
      }
      return;
    }else if(this.shantenchitoitsu <= 0 && this.shantenNormal > 0) {      //七対子
      this.startHanChitoitsu();
      this.fu = 25;
      let fu = this.convertFu();
      if(this.zikaze == 30) {        //親
        this.point = this.pTableParent[fu][this.han - 1];
      }else {                       //子
        this.point = this.pTableChild[fu][this.han - 1];
      }
      return;
    }

    //mentsuの初期化
    for(let i = 0; i < 5; i++) {
      this.mentsu.push({pai: null, type: null});
    }

    //副露牌を切り分け
    if(player.furo.length > 0) {
      for(let i = 0; i < player.furo.length; i++) {
        let furo = player.furo[i];
        if(furo.type == "shunntsu") {
          this.mentsu[this.pointer].type = 2;
        }else if(furo.type == "kotsu"){
          this.mentsu[this.pointer].type = 0;
        }else if(furo.type == "ankan") {
          this.mentsu[this.pointer].type = 5;
        } else if(furo.type == "minkan" || furo.type == "kakan") {
          this.mentsu[this.pointer].type = 4;
        }
        let pai = furo.pai;
        this.mentsu[this.pointer].pai = Math.min(...pai);
        this.pointer++;
      }
    }

    //頭の抜き出し
    for(let i = 0; i < 37; i++) {
      if(!this.tehai[i]) {
        continue;
      }
      if(this.tehai[i] >= 2) {
        this.tehai[i] -= 2;
        this.mentsu[this.pointer].pai = i;
        this.mentsu[this.pointer].type = 6;
        this.pointer++;
        this.mentsuDivide();
        this.pointer--;
        this.mentsu[this.pointer].type = null;
        this.mentsu[this.pointer].pai = null;
        this.tehai[i] += 2;
      }
    }

    this.tehai = this.tempTehai.concat();
    this.ron = false;
    return this.point;
  }

  //面子切り分け
  mentsuDivide() {
    for(let i = 0; i < 37; i++) {
      //手牌になかったら飛ばす
      while(!this.tehai[i]) {
        i++;
        if(i >= 37) {
          break;
        }
      }
      //5つの面子に切り分けたらハン計算、符計算（pointerが５以上になったら）
      if(i >= 37) {
        if(this.pointer >= 5) {
          //for(let a = 0; a < 5; a++) {console.log(this.mentsu[a]);}
          this.startHanNormal();      //ハン計算
          if(this.han > 0) {
            if(this.han <= 4) {         //満貫以下
              this.startFu();           //符計算
              let fu = this.convertFu();//点数早見表配列に対応した数字に変換
              if(this.zikaze == 30) {        //親
                this.tempPoint = this.pTableParent[fu][this.han - 1];
              }else {                        //子
                this.tempPoint = this.pTableChild[fu][this.han - 1];
              }
            }else if(this.han > 4 && this.han <= 5) {     //満貫
              if(this.zikaze == 30) {
                this.tempPoint = 12000;
              }else {
                this.tempPoint = 8000;
              }
            }else if(this.han > 5 && this.han <= 7) {     //跳満
              if(this.zikaze == 30) {
                this.tempPoint = 18000;
              }else {
                this.tempPoint = 12000;
              }
            }else if(this.han > 7 && this.han <= 10) {    //倍満
              if(this.zikaze == 30) {
                this.tempPoint = 24000;
              }else {
                this.tempPoint = 16000;
              }
            }else if(this.han < 10 && this.han <= 12) {    //三倍満
              if(this.zikaze == 30) {
                this.tempPoint = 36000;
              }else {
                this.tempPoint = 24000;
              }
            }else if(this.han > 12) {                     //役満
              let times = Math.floor(this.han / 13);          //ダブル、トリプル...の場合はこれをかける
              if(this.zikaze == 30) {
                this.tempPoint = 48000 * times;
              }else {
                this.tempPoint = 32000 * times;
              }
            }
            this.point = this.point > this.tempPoint ? this.point : this.tempPoint;
            /*console.log("点数　= " + this.point);
            console.log("ハン数 = " + this.han);
            console.log("符数 = " + this.fu);
            console.log(this.yakuName);*/
          }
          return;
        }
      }
      //暗刻切り分け
      if(this.tehai[i] >= 3) {
        this.tehai[i] -= 3;
        if(i == this.atarihai && this.ron) {
          this.mentsu[this.pointer].type = 0;
        }else {
          this.mentsu[this.pointer].type = 1;
        }
        this.mentsu[this.pointer].pai = i;
        this.pointer++;
        this.mentsuDivide();
        this.pointer--;
        this.mentsu[this.pointer].pai = null;
        this.mentsu[this.pointer].type = null;
        this.tehai[i] -= 3;
      }
      //順子切り分け
      if(this.tehai[i] && this.tehai[i + 1] && this.tehai[i + 2] && i < 30) {
        this.tehai[i]--, this.tehai[i + 1]--, this.tehai[i + 2]--;
        this.mentsu[this.pointer].type = 3;
        this.mentsu[this.pointer].pai = i;
        this.pointer++;
        this.mentsuDivide();
        this.pointer--;
        this.mentsu[this.pointer].pai = null;
        this.mentsu[this.pointer].type = null;
        this.tehai[i]++, this.tehai[i + 1]++, this.tehai[i + 2]++;
      }
    }
  }

  //符計算
  startFu() {
    //平和の場合
    if(this.yaku.pinfu.flag) {
      if(!this.ron) {
        this.tempFu = 20;
      }else {
        this.tempFu = 30;
      }
      this.fu = this.fu > this.tempFu ? this.fu : this.tempFu;
      return;
    }
    //平和でない場合
    this.tempFu = 20;             //基本点２０
    if(this.ron && this.menzen) {this.tempFu += 10;}    //面前ロン
    if(!this.ron) {this.tempFu += 2;}                   //ツモの場合

    let mentsu;
    for(let i = 0; i < 5; i++) {
      //待ち
      mentsu = this.mentsu[i];
      if(mentsu.type == 6) {                    //単騎
        if(mentsu.pai == this.atatihai) {
          this.tempFu += 2;
        }
      }else if(mentsu.type == 3) {
        if((mentsu.pai + 2 == this.atarihai && mentsu.pai % 10 == 0) ||   //ペン３
          (mentsu.pai - 2 == this.atarihai && mentsu.pai % 10 == 8) ||    //ペン３
          (mentsu.pai + 1 == this.atarihai && mentsu.pai % 10 <= 6))      //カンチャン
        {
          this.tempFu += 2;
        }
      }
      //頭
      if(mentsu.type == 6) {
        if(mentsu.pai >= 34 || mentsu.pai == this.zikaze || mentsu.pai == this.bakaze) {
          this.tempFu += 2;
        }
      }
      //面子
      if(mentsu.type == 0) {        //ポン
        if(mentsu.pai % 10 == 0 || mentsu.pai % 10 == 8 || mentsu.pai >= 30) {    //ヤオチュウ牌
          this.tempFu += 4;
        }else {                                                                   //チュウチャン牌
          this.tempFu += 2;
        }
      }else if(mentsu.type == 1) { //暗刻
        if(mentsu.pai % 10 == 0 || mentsu.pai % 10 == 8 || mentsu.pai >= 30) {    //ヤオチュウ牌
          this.tempFu += 8;
        }else {                                                                   //チュウチャン牌
          this.tempFu += 4;
        }
      }else if(mentsu.type == 4) { //明槓
        if(mentsu.pai % 10 == 0 || mentsu.pai % 10 == 8 || mentsu.pai >= 30) {    //ヤオチュウ牌
          this.tempFu += 16;
        }else {                                                                   //チュウチャン牌
          this.tempFu += 8;
        }
      }else if(mentsu.type == 5) { //暗槓
        if(mentsu.pai % 10 == 0 || mentsu.pai % 10 == 8 || mentsu.pai >= 30) {    //ヤオチュウ牌
          this.tempFu += 32;
        }else {                                                                   //チュウチャン牌
          this.tempFu += 16;
        }
      }
    }
    //鳴き平和形（ここまででまだ２０符のとき）
    if(this.tempFu == 20) {this.tempFu = 30;}
    //１の位切り上げ
    this.tempFu = Math.ceil(this.tempFu / 10) * 10;
    //this.fu = this.fu > this.tempFu ? this.fu : this.tempFu;
    this.fu = this.tempFu;
  }

  //符を点数早見表の配列に対応するように変換
  convertFu() {
    if(this.fu == 20)  {return 0;}
    if(this.fu == 25)  {return 1;}
    if(this.fu == 30)  {return 2;}
    if(this.fu == 40)  {return 3;}
    if(this.fu == 50)  {return 4;}
    if(this.fu == 60)  {return 5;}
    if(this.fu == 70)  {return 6;}
    if(this.fu == 80)  {return 7;}
    if(this.fu == 90)  {return 8;}
    if(this.fu == 100) {return 9;}
    if(this.fu == 110) {return 10;}
  }

  //ハン計算
  //役早見表の初期化
  initYaku() {
    let yakuKey = Object.keys(this.yaku);
    for(let key of yakuKey) {
      this.yaku[key].flag = false;
    }
  }

  //役の判定
  yakuJudge(key) {
    if(this.yaku[key].method()) {
      this.yaku[key].flag = true;
      if((key == "chinitsu"      //食い下がり
        || key == "honitsu"
        || key == "sanshokuDozyun"
        || key == "ikkitsukan"
        || key == "chanta"
        || key == "jyunchanta") && !this.menzen)
      {
        this.tempHan += this.yaku[key].han - 1;
      }else
      {
        this.tempHan += this.yaku[key].han;
      }
      this.tempYakuName.push(this.yaku[key].value);
    }
  }

  //七対子のハン計算
  satrtHanChitoitsu() {
    this.initYaku();
    this.yakuJudge("chitoitsu");
    //役満の確認
    this.yakuJudge("tenho");
    this.yakujudge("chiho");
    this.yakuJudge("tsuiso");
    if(this.tempHan >= 13) {
      this.han = this.tempHan;
      this.yakuName = this.tempYakuName.concat();
      return;
    }
    //役満でない場合
    this.yakuJudge("tanyao");
    this.yakuJudge("chinitsu");
    if(!this.yaku.chinitsu.flag) {
      this.yakuJudge("honitsu");
      this.yakuJudge("honroto")
    }
    this.yakuJudge("doublelizhi");
    if(!this.yaku.doublelizhi.flag) {
      this.yakuJudge("lizhi");
    }
    if(this.yaku.lizhi.flag || this.yaku.doublelizhi.flag) {
      this.yakuJudge("ippatsu");
    }
    this.yakuJudge("menzentumo");
    //ハンの計算
    this.han = this.tempaHan;
    if(this.han > 0) {
      for(let i = 0; i < this.dora; i++) {        //ドラを加算
        if(this.intTehai[this.dora[i]] > 0) {
          this.han += this.intTehai[this.dora[i]];
        }
      }
      if(this.yaku.lizhi.flag) {
        for(let i = 0; i < this.uraDora; i++) {        //裏ドラを加算
          if(this.intTehai[this.uraDora[i]] > 0) {
            this.han += this.intTehai[this.uraDora[i]];
          }
        }
      }
    }
    this.yakuName = this.tempYakuName.concat();
  }

  //ハン計算の開始
  startHanNormal() {
    //初期化
    this.tempHan = 0;
    this.tempYakuName = [];
    this.initYaku();
    //役早見表のkeyを配列に格納
    let yakuKey = Object.keys(this.yaku);
    //役満の確認
    for(let key of yakuKey) {
      if(this.yaku[key].han != 13) {break;}
      if(key == "kokushimuso") {continue;}
      this.yakuJudge(key);
    }
    //役満だった場合はその後処理を飛ばす
    if(this.tempHan >= 13) {
      this.han = this.han > this.tempHan ? this.han : this.tempHan;
      this.yakuName = this.han > this.tempHan ? this.yakuName : this.tempYakuName.concat();
      return;
    }
    //役満出なかった場合
    //面子構成に関係ない役を判定
    this.yakuJudge("tanyao");
    this.yakuJudge("rinshankaiho");
    if(!this.yaku.tanyao.flag) {
      this.yakuJudge("chinitsu");
      if(!this.yaku.chinitsu.flag) {
        this.yakuJudge("honitsu");
        this.yakuJudge("honroto");
      }
      this.yakuJudge("shosangen");
    }
    if(this.menzen) {
      this.yakuJudge("lizhi");
      if(!this.yaku.lizhi.flag) {this.yakuJudge("doublelizhi");}
      this.yakuJudge("ippatsu");
      this.yakuJudge("menzentumo");
    }
    //面子構成に関係ある役の判定
    if(!this.yaku.tanyao.flag) {
      if(!this.yaku.honroto.flag) {
        this.yakuJudge("jyunchanta");
        if(!this.yaku.jyunchanta.flag) {
          this.yakuJudge("chanta");
        }
      }
    }
    if(!this.yaku.rinshankaiho.flag) {
      this.yakuJudge("pinfu");
    }
    if(!this.yaku.pinfu.flag) {
      this.yakuJudge("toitoi");
      this.yakuJudge("sananko");
      this.yakuJudge("sanshokuDoko");
      this.yakuJudge("sankantsu");
      this.yakuJudge("yakuhai");
    }
    if(!this.yaku.toitoi.flag || !this.yaku.sananko.flag || !this.yaku.sanshokuDoko.flag || !this.yaku.sankantsu.flag) {
      this.yakuJudge("ryanpeko");
      if(!this.yaku.ryanpeko.flag) {
        this.yakuJudge("ipeko");
      }
      this.yakuJudge("sanshokuDozyun");
      if(!this.yaku.sanshokuDozyun.flag) {
        this.yakuJudge("ikkitsukan");
      }
    }
    //ドラ
    if(this.tempHan > 0) {
      let count = 0;
      for(let i = 0; i < this.dora; i++) {        //ドラを加算
        if(this.intTehai[this.dora[i]] > 0) {
          count++;
          this.tempHan += this.intTehai[this.dora[i]];
        }
      }
      if(this.yaku.lizhi.flag) {
        for(let i = 0; i < this.uraDora; i++) {        //裏ドラを加算
          if(this.intTehai[this.uraDora[i]] > 0) {
            count++;
            this.han += this.intTehai[this.uraDora[i]];
          }
        }
      }
      if(count) {this.tempYakuName.push("ドラ" + count);}
    }
    //ハン計算
    this.han = this.han > this.tempHan ? this.han : this.tempHan;
    this.yakuName = this.han > this.tempHan ? this.yakuName : this.tempYakuName.concat();
  }

  //役満
  //天和
  tenho() {
    //複合しない役がある場合はfalse
    if(this.yaku.sukantsu.flag ||
      this.yaku.chiho.flag ||
      !this.menzen)
    {
      return false;
    }

    if(this.tenhoFlag && !this.ron) {
      return true;
    }
    return false;
  }

  //地和
  chiho() {
    //複合しない役がある場合はfalse
    if(this.yaku.sukantsu.flag ||
      this.yaku.tenho.flag ||
      !this.menzen)
    {
      return false;
    }

    if(this.tenhoFlag && this.ron) {
      return true;
    }
    return false;
  }

  //九蓮宝燈
  tyuren() {
    //複合しない役がある場合はfalse
    if(this.yaku.suanko.flag ||
      this.yaku.daisangen.flag ||
      this.yaku.shosushi.flag ||
      this.yaku.daisushi.flag ||
      this.yaku.tsuiso.flag ||
      this.yaku.ryuiso.flag ||
      this.yaku.chinroto.flag ||
      this.yaku.sukantsu.flag ||
      !this.menzen)
    {
      return false;
    }
    let min, max;                 //とりうる牌種の最小値と最大値
    for(let i = 0; i < 37; i++) { //最小値と最大値を割り出す
      if(this.intTehai[i]) {
        if(i >= 0 && i < 9) {     //萬子
          min = 0, max = 8;
          break;
        }else if(i >= 10 && i < 19) {   //筒子
          min = 10, max = 18;
          break;
        }else if(i >= 20 && i < 29) {   //索子
          min = 20, max = 28;
          break;
        }else {                 //字牌だったらfalse
          return false;
        }
      }
    }
    //１、９が三枚以下だったらfalse
    if(this.intTehai[min] < 3 || this.intTehai[max] < 3) {
      return false;
    }
    //違う色の牌があったらfalse
    for(let i = 0; i < 30; i++) {
      if(i < min || i > max) {
        if(this.intTehai[i]) {
          return false;
        }
      }
    }
    //同じ色の牌で持ってない種があったらfalse
    for(let i = min; i <= max; i++) {
      if(!this.intTehai[i]) {
        return false;
      }
    }
    return true;
  }

  //大四喜
  daisushi() {
    //複合しない役がある場合はfalse
    if(this.yaku.daisangen.flag ||
      this.yaku.shosangen.flag ||
      this.yaku.ryuiso.flag ||
      this.yaku.chinroto.flag ||
      this.yaku.sukantsu.flag ||
      this.yaku.tyuren.flag ||
      this.yaku.shosushi.flag)
    {
      return false;
    }
    //東、南、西、北が三枚以下ならfalse
    for(let i = 30; i < 34; i++) {
      if(this.intTehai[i] < 3) {
        return false;
      }
    }
    return true;
  }

  //四暗刻
  suanko() {
    //複合しない役がある場合はfalse
    if(this.yaku.tyuren.flag ||
      !this.menzen)
    {
      return false;
    }
    //面前ではなかったらfalse
    if(!this.menzen) {
      return false;
    }
    let count = 0;          //暗刻、暗槓の数
    this.mentsu.forEach(value => {
      if(value.type == 1 || value == 5) {     //typeがanko, ankanのときcountをプラス
        count++;
      }
    });
    //countが４以上ならtrue
    if(count >= 4) {
      return true;
    }else {
      return false;
    }
  }

  //字一色
  tsuiso() {
    //複合しない役がある場合はfalse
    if(this.yaku.ryuiso.flag ||
      this.yaku.chinroto.flag ||
      this.yaku.tyuren.flag)
    {
      return false;
    }
    //字牌以外があったらflagにtrue
    let flag = this.intTehai.some((value, index) => {
      if(index < 30 && value >= 1) {
        return true;
      }
    });
    if(flag) {      //flagがtrueならfalse
      return false;
    }else {
      return true;
    }
  }

  //緑一色
  ryuiso() {
    //複合しない役がある場合はfalse
    if(this.yaku.daisangen.flag ||
      this.yaku.daisushi.flag ||
      this.yaku.shosushi.flag ||
      this.yaku.tsuiso.flag ||
      this.yaku.sukantsu.flag)
    {
      return false;
    }
    let type = [21, 22, 23, 25, 27, 35];        //緑一色の牌種
    for(let i = 0; i < 37; i++) {
      if(type.some(value => value == i)) {      //緑一色の牌種だった場合は次へ
        continue;
      }
      if(this.intTehai[i]) {                    //緑一色の牌種以外の牌があったらfalse
        return false;
      }
    }
    return true;
  }

  //小四喜
  shosushi() {
    //複合しない役がある場合はfalse
    if(this.yaku.daisangen.flag ||
      this.yaku.daisushi.flag ||
      this.yaku.tyuren.flag ||
      this.yaku.ryuiso.flag ||
      this.yaku.chinroto.flag)
    {
      return false;
    }
    let count = 0;                          //東、南、西、北を含む面子の数
    let type = [30, 31, 32, 33];            //東、南、西、北
    this.mentsu.forEach(mentsu => {
      if(type.some(value => value == mentsu.pai)) {
        count++;
      }
    });
    if(count >= 4) {
      return true;
    }else {
      return false;
    }
  }

  //大三元
  daisangen() {
    //複合しない役がある場合はfalse
    if(this.yaku.tyuren.flag ||
      this.yaku.ryuiso.flag ||
      this.yaku.shosushi.flag ||
      this.yaku.daisushi.flag ||
      this.yaku.chinroto.flag)
    {
      return false;
    }
    for(let i = 34; i < 37; i++) {        //三元牌が三枚以下だったらfalse
      if(this.intTehai[i] < 3) {
        return false;
      }
    }
    return true;
  }

  //清老頭
  chinroto() {
    //複合しない役がある場合はfalse
    if(this.yaku.daisangen.flag ||
      this.yaku.daisushi.flag ||
      this.yaku.shosushi.flag ||
      this.yaku.tsuiso.flag ||
      this.yaku.tyuren.flag ||
      this.yaku.ryuiso.flag)
    {
      return false;
    }
    let type = [0, 8, 10, 18, 20, 28];          //老頭牌の牌種
    for(let i = 0; i < 37; i++) {
      if(type.some(value => value == i)) {      //老頭牌の牌種だった場合は次へ
        continue;
      }
      if(this.intTehai[i]) {                    //老頭牌の牌種以外の牌があったらfalse
        return false;
      }
    }
    return true;
  }

  //四槓子
  sukantsu() {
    //複合しない役がある場合はfalse
    if(this.yaku.tyuren.flag ||
      this.yaku.tenho.flag ||
      this.yaku.chiho.flag)
    {
      return false;
    }
    let count = 0;
    for(let i = 0; i < 5; i++) {
      if(this.mentsu[i].type == 4 || this.mentsu[i].type == 5) {
        count++;
      }
    }
    if(count == 4) {
      return true;
    }
  }

  //三槓子
  sankantsu() {
    let count = 0;
    for(let i = 0; i < 5; i++) {
      if(this.mentsu[i].type == 4 || this.mentsu[i].type == 5) {
        count++;
      }
    }
    if(count == 3) {
      return true;
    }
  }

  //立直
  lizhi() {
    if(!this.menzen || this.yaku.doublelizhi.flag) {return false;}
    if(this.lizhiState.flag && this.lizhiState.num != 0) {
      return true;
    }
    return false;
  }

  //ダブル立直
  doublelizhi() {
    if(!this.menzen || this.yaku.lizhi.flag) {return false;}
    if(this.lizhiState.flag && this.lizhiState.num == 0) {
      return true;
    }
    return false;
  }

  //一発
  ippatsu() {
    if(!this.menzen) {return false;}
    if(this.lizhiState.ippatsu) {
      return true;
    }
    return false;
  }

  //面前ツモ
  menzentumo() {
    if(!this.menzen) {return false;}
    if(!this.ron) {
      return true;
    }
    return false;
  }

  //海底撈月
  haitei() {
    if(this.haitei && this.ron) {
      return true;
    }
    return false;
  }

  //河底
  hotei() {
    if(this.haitei && !this.ron) {
      return true;
    }
    return false;
  }

  //嶺上開花
  rinshankaiho() {
    if(this.yaku.pinfu.flag) {return false;}
    if(!this.ron && this.rinshanFlag) {
      return true;
    }
    return false;
  }

  //ピンフ
  pinfu() {
    let toitsu = this.mentsu.filter(value => {      //対子抜き出し
      return value.type == 6;
    });
    let shuntsu = this.mentsu.filter(value => {    //順子抜き出し
      return value.type == 3;
    });
    //対子が役牌だったらfalse
    if(toitsu[0].pai == this.bakaze || toitsu[0].pai == this.zikaze || toitsu[0].pai >= 34) {
      return false;
    }
    //順子が４つ以下だったらfalse
    if(shuntsu.length < 4) {
      return false;
    }
    //両面か調べる
    let ryanmen = false;
    shuntsu.some(value => {
      if((value.pai == this.atarihai && value.pai % 10 == 0)
        || ((value.pai == this.atarihai || value.pai + 2 == this.atarihai) && (value.pai % 10 > 0 && value.pai % 10 < 6))
        || (value.pai + 2 == this.atarihai && value.pai % 10 == 6)) {
        ryanmen = true;
      }
    });
    return ryanmen;
  }

  //タンヤオ
  tanyao() {
    //1，9、字牌がなければtrue
    for(let i = 0; i < 37; i++) {
      if(!this.intTehai[i]) {continue;}
      if(i % 10 == 0 || i % 10 == 8 || i > 29) {
        return false;
      }
    }
    return true;
  }

  //二盃口
  ryanpeko() {
    let shuntsu = this.mentsu.filter(value => {   //順子を抜き出す
      return value.type == 3;
    });
    if(shuntsu.length < 2) {                      //順子の数が２つ以下だったらfalse
      return false;
    }
    let count = 0;
    shuntsu.forEach((value, index, array) => {    //同じ面子が２つあったらcountにプラス
      let other = array.findIndex((_value, _index, _array) => {
        return value.pai == _value.pai;
      });
      if(other != index) {
        count++;
      }
    });
    if(count == 2) {
      return true;
    }
  }

  //一盃口
  ipeko() {
    let shuntsu = this.mentsu.filter(value => {   //順子を抜き出す
      return value.type == 3;
    });
    if(shuntsu.length < 2) {                      //順子の数が２つ以下だったらfalse
      return false;
    }
    let count = 0;
    shuntsu.forEach((value, index, array) => {    //同じ面子が２つあったらcountにプラス
      let other = array.findIndex((_value, _index, _array) => {
        return value.pai == _value.pai;
      });
      if(other != index) {
        count++;
      }
    });
    if(count == 1) {
      return true;
    }
  }

  //役牌
  yakuhai(type) {
    if(this.intTehai[type] >= 3) {
      return true;
    }
    return false;
  }

  //チャンタ
  chanta() {
    let flag = true;                           //返り値になる変数
    this.mentsu.some((value, index, array) => {
      if(!(value.type == 2 || value.type == 3)) {   //順子以外だったら１，９、字牌か確認
        if(!(value.pai % 10 == 0 || value.pai % 10 == 8 || value.pai > 29)) {
          flag = false;
          return true;
        }
      }else if(value.type == 2 || value.type == 3) {    //順子だったら１２３、７８９か確認
        if(!(value.pai % 10 == 0 || value.pai % 10 == 6)) {
          flag = false;
          return true;
        }
      }
    });
    return flag;
  }

  //三色同順
  sanshokuDozyun() {
    let work = new Array(30);             //作業用
    this.mentsu.forEach((value, index, array) => {
      if(value.type == 2 || value.type == 3) {      //順子だったら牌の番号のworkにプラス
        work[value.pai]++;
      }
    });
    for(let i = 0; i < 7; i++) {        //同じ番号で違う色の順子が３つあったらtrue
      if(work[i] && work[i + 10] && work[i + 20]) {
        return true;
      }
    }
    return false;
  }

  //一気通貫
  ikkitsukan() {
    let work = [0, 0, 0, 0, 0, 0, 0, 0, 0];         //０～２->萬子、３～５->筒子、６～８->索子
    this.mentsu.forEach((value, index, array) => {
      if(value.type == 2 || value.type == 3) {
        if(value.pai == 0) {work[0] = 1}
        else if(value.pai == 3) {work[1] = 1}
        else if(value.pai == 6) {work[2] = 1}
        else if(value.pai == 10) {work[3] = 1}
        else if(value.pai == 13) {work[4] = 1}
        else if(value.pai == 16) {work[5] = 1}
        else if(value.pai == 20) {work[6] = 1}
        else if(value.pai == 23) {work[7] = 1}
        else if(value.pai == 26) {work[8] = 1}
      }
    });
    if((work[0] && work[1] && work[2]) || (work[3] && work[4] && work[5]) || (work[6] && work[7] && work[8])) {
      return true;
    }
    return false;
  }

  //対々和
  toitoi() {
    for(let i = 0; i < 5; i++) {
      if(this.mentsu[i].type == 2 || this.mentsu[i].type == 3) {
        return false;
      }
    }
    return true;
  }

  //三色同刻
  sanshokuDoko() {
    let work = new Array(30);             //作業用
    this.mentsu.forEach((value, index, array) => {
      if(!(value.type == 2 || value.type == 3 || value.type == 6)) {      //順子と対子以外だったら牌の番号のworkにプラス
        work[value.pai]++;
      }
    });
    for(let i = 0; i < 9; i++) {        //同じ番号で違う色の順子が３つあったらtrue
      if(work[i] && work[i + 10] && work[i + 20]) {
        return true;
      }
    }
    return false;
  }

  //混老頭
  honroto() {
    let type = [0, 8, 10, 18, 20, 28, 30, 31, 32, 33, 34, 35, 36];    //老頭牌と字牌の牌種
    for(let i = 0; i < 37; i++) {
      if(type.some(value => value == i)) {      //老頭牌と字牌の牌種だった場合は次へ
        continue;
      }
      if(this.intTehai[i]) {                    //老頭牌と字牌の牌種以外の牌があったらfalse
        return false;
      }
    }
    return true;
  }

  //三暗刻
  sananko() {
    let count = 0;
    for(let i = 0; i < 5; i++) {
      if(this.mentsu[i].type == 1 || this.mentsu[i].type == 5) {
        count++;
      }
    }
    if(count >= 3) {
      return true;
    }else {
      return false;
    }
  }

  //小三元
  shosangen() {
    let sangen = this.mentsu.filter(value => {      //三元牌を抜き出す
      return value.pai == 34 || value.pai == 35 || value.pai == 36;
    });
    if(sangen.length < 3) {                         //三種抜き出せなかったらfalse
      return false;
    }
    if(sangen.some(value => value.type == 6)) {     //１つでも対子だったらtrue
      return true;
    }
    return false;
  }

  //混一色
  honitsu() {
    let min, max;
    for(let i = 0; i < 37; i++) {
      if(!this.intTehai[i]) {continue;}
      if(i <= 0 && i < 9) {
        min = 0, max = 9;
        break;
      }else if(i <= 10 && i < 19) {
        min = 10, max = 19;
        break;
      }else if(i <= 20 && i < 29) {
        min = 20, max = 29;
        break;
      }else if(i >= 30) {
        return false;
      }
    }
    for(let i = 0; i < 37; i++) {
      if((i >= min && i < max) || i >= 30) {
        continue;
      }
      if(this.intTehai[i]) {
        return false;
      }
    }
    return true;
  }

  //純チャンタ
  jyunChanta() {
    let flag = true;                           //返り値になる変数
    this.mentsu.some((value, index, array) => {
      if(!(value.type == 2 || value.type == 3)) {   //順子以外だったら１，９牌か確認
        if(!(value.pai % 10 == 0 || value.pai % 10 == 8)) {
          flag = false;
          return true;
        }
      }else if(value.type == 2 || value.type == 3) {    //順子だったら１２３、７８９か確認
        if(!(value.pai % 10 == 0 || value.pai % 10 == 6)) {
          flag = false;
          return true;
        }
      }
    });
    return flag;
  }

  //清一色
  chinitsu() {
    let min, max;
    for(let i = 0; i < 37; i++) {
      if(!this.intTehai[i]) {continue;}
      if(i <= 0 && i < 9) {
        min = 0, max = 9;
        break;
      }else if(i <= 10 && i < 19) {
        min = 10, max = 19;
        break;
      }else if(i <= 20 && i < 29) {
        min = 20, max = 29;
        break;
      }else if(i >= 30) {
        return false;
      }
    }
    for(let i = 0; i < 30; i++) {
      if(i >= min && i < max) {
        continue;
      }
      if(this.intTehai[i]) {
        return false;
      }
    }
    return true;
  }
}
