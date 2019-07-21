//モジュール
const Player = require('./player.js');
const Yama = require('./yama.js');

//ワールド毎の管理
module.exports = class World
{
  constructor(name, listIndex) {
    this.name = name;                //ワールドの名前
    this.playerList = [];            //プレイヤーを格納する配列
    this.currentPalyer = null;       //現在ターンのプレイヤー
    this.agariPlayer = null;         //上がったプレイヤー
    this.yama = new Yama();          //山
    this.state = {
      turn: 0,                //現在のターン
      bakaze: 0,              //現在が東場->0 か南場->1か
      kyoku: 0,               //現在の局 1局->0 2局->1 3局->2 4局->3
      phase: "wait",          //現在のフェーズ (wait, discard, furoCheck, result, ryukyoku)
      haitei: false,          //現在が河底か判定
      kyotaku: 0,             //現在の供卓棒
      tumibo: 0               //積み棒
    };
    this.discardPai;          //直近の捨てられた牌
    //副露に対してのプレイヤーの反応状況
    this.furoState = this.createFuroState();
    this.minkanFlag = false;  //明槓が行われたか判定
    this.playerReaction = 0;
  }

  //初期化
  init() {
    this.currentPalyer = null;
    this.agariPlayer = null;
    this.state = {
      turn: 0,
      bakaze: 0,
      kyoku: 0,
      phase: "wait",
      haitei: false,
      kyotaku: 0,
      tumibo: 0
    };
    this.discardPai;
    this.furoState = this.createFuroState();
    this.minkanFlag = false;
    this.playerReaction = 0;
    this.playerList.forEach(player => {
      player.init();
    })
  }

  //プレイヤー入室
  createPlayer(name) {
    const player = new Player(name);
    this.playerList.push(player);
    return player;
  }

  //プレイヤー退出
  leavePlayer(listIndex) {
    this.playerList.some((player, index, array) => {
      if(player.listIndex == listIndex) {
        array.splice(index, 1);
        return true;
      }
    });
  }

  //ワールド内のプレイヤーの数（最大4人）
  get player_NO() {
    return this.playerList.length;
  }

  //対局開始
  start() {
    this.state.phase = "discard";
    this.parentSet();
    this.haipai();
    /*for(let x = 0; x < 4; x++) {
      this.playerList[x].tehai = [0,0,0,0,1,1,1,31,5,24,22,8,7];
    }*/
    this.tumo();
  }

  //手牌を配る
  haipai() {
    for(let x = 0; x < 52; x++) {
      if(x < 13) {
        this.playerList.some(player => {
          if(player.turn == this.state.turn) {
            player.tehai.push(this.yama.self[x]);
            //player.tehai = [0,1,2,3,4,5,6,7,8,10,11,12,13];
            return true;
          }
        });
      }else if(x >= 13 && x < 26) {
        this.playerList.some(player => {
          if(player.turn == (this.state.turn + 1) % 4) {
            player.tehai.push(this.yama.self[x]);
            return true;
          }
        });
      }else if(x >= 26 && x < 39) {
        this.playerList.some(player => {
          if(player.turn == (this.state.turn + 2) % 4) {
            player.tehai.push(this.yama.self[x]);
            return true;
          }
        });
      }else if(x >= 39) {
        this.playerList.some(player => {
          if(player.turn == (this.state.turn + 3) % 4) {
            player.tehai.push(this.yama.self[x]);
            return true;
          }
        });
      }
    }
    this.yama.current = 52;
    this.yama.haitei = 121;//55;
    for(let x = 0; x < this.playerList.length; x++) {
      this.playerList[x].tehaiSort();
    }
  }

  //ターンを進める
  turnChange() {
    this.state.turn = (this.state.turn + 1) % 4;
    this.state.phase = "discard";
    this.tumo();
    this.furoState = this.createFuroState();
  }

  //親を決める
  parentSet() {
    for(let i = this.playerList.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.playerList[i], this.playerList[j]] = [this.playerList[j], this.playerList[i]];
    }
    for(let x = 0; x < 4; x++) {
      //console.log(this.playerList[x].name);
      this.playerList[x].turn = x;
      this.playerList[x].listIndex = x;
    }
  }

  //自摸
  tumo() {
    this.playerList.some(player => {
      if(player.turn == this.state.turn) {
        player.tehai.push(this.yama.self[this.yama.current]);
        player.tumoFlag = true;
        this.currentPlayer = player;
        this.yama.current++;
        return true;
      }
    });
    this.haiteiCheck();
  }

  //海底か調べる
  haiteiCheck() {
    if(this.yama.current >= this.yama.haitei) {
      this.state.haitei = true;
    }
  }

  //furoStateを作る
  createFuroState() {
    //reaction->反応数　request->鳴こうとしているプレイヤーと牌種を表すオブジェクトを格納している配列
    return {
      reaction: 0,
      request: []
    }
  }

  //副露希望者が複数の場合に優先者を決める
  decideFuroPlayer() {
    let priority;
    this.furoState.request.some((value, index) => {
      if(value.pai.length == 1 || value.pai.length == 3) {
        priority = index;
        return true;
      }
    });
    return priority;
  }

  //副露処理
  doFuro(priority) {
    let listIndex = this.furoState.request[priority].player;
    let furoAblePai = this.furoState.request[priority].pai;
    let furoPlayer = this.playerList[listIndex];
    let furo = furoPlayer.doFuro(this.discardPai, furoAblePai, this.state.turn);
    //副露牌を捨て牌から取り除く
    this.playerList.forEach((player, index, array) => {
      if(this.state.turn == player.turn) {
        player.sutehai.pop();
        //console.log(player.name, player.sutehai);
      }
      if(player.lizhi.ippatsu) {
        player.lizhi.ippatsu = false;
      }
    });
    //明槓だった場合
    if(furo.type == "minkan") {
      furoPlayer.tehai.push(this.yama.rinshan.splice(0, 1));
      this.yama.haitei--;
      this.haiteiCheck();
      furoPlayer.tumoFlag = true;
      furoPlayer.rinshanFlag = true;
      this.minkanFlag = true;
    }
    this.state.turn = furoPlayer.turn;
    this.currentPlayer = furoPlayer;
    this.state.phase = "discard";
    this.furoState = this.createFuroState();
  }

  //次の局に進む
  kyokuProceed() {
    let proceed = false;              //player.kyokuProceedの引数になる真偽値
    //初期化
    this.furoState = this.createFuroState();
    this.currentPlayer = null;
    //stateの変更
    this.state.turn = 0;
    this.state.haitei = false;
    this.state.phase = "discard";
    if(this.agariPlayer !== null) {         //誰かが上がった場合(agariPlayerがnullではない)
      if(this.agariPlayer.turn != 0) {        //上がったプレイヤーが子の場合
        this.state.kyoku = (this.state.kyoku + 1) % 4;       //局を進める
        //this.state.bakaze = this.state.kyoku == 0 ? 1 : 0;   //東４局の場合は南入
        this.state.bakasze  = this.state.kyoku == 0 ? this.state.bakaze++ : this.state.bakaze;    //局が一周した場合は場風が進む
        this.state.tumibo = 0;                               //積み棒を初期化
        proceed = true;                                      //turnが進む場合はtrue
      }else if(this.agariPlayer.turn == 0) {  //上がったプレイヤーが親の場合
        this.state.tumibo++;
      }
      this.state.kyotaku = 0;       //供卓棒の初期化
      this.agariPlayer = null;      //上がったプレイヤーの初期化
    }else {                                 //流局時
      if(this.playerList.some(player => player.turn == 0 && player.shantenCount == 0)) {      //親がテンパイ
        this.state.tumibo++;
      }else {                                                                                 //親がテンパイではない
        //局を進める処理
        this.state.kyoku = (this.state.kyoku + 1) % 4;
        //this.state.bakaze = this.state.kyoku == 0 ? 1 : 0;
        this.state.bakasze  = this.state.kyoku == 0 ? this.state.bakaze++ : this.state.bakaze;
        this.state.tumibo = 0;
        proceed = true;
      }
    }
    //プレイヤーの局を進める処理
    this.playerList.forEach(player => {
      player.kyokuProceed(proceed);
    });
    //山を混ぜる
    this.yama.shuffle(this.yama.self);
    this.haipai();        //配牌
    this.tumo();          //第１ツモ
    this.playerReaction = 0;      //playerReactionを初期化
  }

  //終局時の処理
  shukyoku() {
    let rank = this.playerList.concat();
    rank.sort((playerA, playerB) => playerB.point - playerA.point);
    this.playerReaction = 0;
    return rank;
  }
}
