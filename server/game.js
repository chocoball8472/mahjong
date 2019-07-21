//モジュール
const World = require('./world.js');

//ゲーム全体を管理
module.exports = class Game
{
  constructor(io) {
    this.io = io;
  }

  startUp() {
    let worldList = [];         //現在存在するワールドを格納
    let activeWorld_NO = 0;     //ワールドの数
    let activePlayer_NO = 0;    //プレイヤーの数

    this.io.on('connection', socket => {
      let myWorld;              //自分が所属するワールド
      let player;               //自分自身となるプレイヤー

      //接続確認
      socket.on('connectRequest', () => {
        socket.emit('init', "接続成功です。");
      });

      //接続時にワールドに入室
      socket.on('entry', name => {
        activePlayer_NO++;
        let _name;                      //プレイヤーの名前になる変数
        if(name == "") {                //空欄だったらPlayer + number
          _name = "Player" + activePlayer_NO;
        }else {                         //入力されていたらそのまま
          _name = name;
        }
        if(worldList.length <= 0) {
          activeWorld_NO++;
          //myWorld = new World("World" + activeWorld_NO, worldList.length);
          myWorld = this.createWorld(worldList);
          player = myWorld.createPlayer(_name);
          //worldList.push(myWorld);
          socket.join(myWorld.name);
        }else {
          let flag = true;
          worldList.some(world => {
            if(world === undefined) {return;}
            if(world.player_NO < 4) {
              myWorld = world;
              player = myWorld.createPlayer(_name);
              socket.join(myWorld.name);
              flag = false;
              return true;
            }
          });
          if(flag) {
            activeWorld_NO++;
            //myWorld = new World("World" + activeWorld_NO, worldList.length);
            myWorld = this.createWorld(worldList);
            player = myWorld.createPlayer(_name);
            //worldList.push(myWorld);
            socket.join(myWorld.name);
          }
        }
        socket.emit('entryConfirm', myWorld.name);

        //入室時人数が４人なら対局開始、4人以下なら待機
        if(myWorld.player_NO == 4) {
          myWorld.start();
          //console.log("対局開始");
          this.io.to(myWorld.name).emit('startInfo');
        }else if(myWorld.player_NO < 4) {
          //this.io.to(myWorld.name).emit('wait', player);
          socket.emit('wait', player);
        }
      });

      //各プレイヤーに手牌とプレイヤーリストのインデックス番号を送信
      socket.on('start', () => {
        socket.emit('start', myWorld.state, myWorld.yama, myWorld.playerList, player.listIndex);
      });

      //牌を捨てた時の処理
      socket.on('discard', point => {
        if(myWorld.minkanFlag) {            //明槓をしていたらドラを追加してセンターウィンドウを更新
          myWorld.yama.doraHyo[myWorld.yama.doraHyo.length - 1]++;
          myWorld.yama.uraDoraHyo[myWorld.yama.uraDoraHyo.length - 1]++;
          myWorld.yama.createDora();
          this.io.to(myWorld.name).emit('windowUpdate', myWorld.state, myWorld.yama, myWorld.playerList);
          myWorld.minkanFlag = false;
        }
        if(player.lizhi.ippatsu) {            //立直後に一巡したら
          player.lizhi.ippatsu = false;       //一発が消える
        }
        if(player.sutehai.length == player.lizhi.num) {     //立直ボタン押した後の捨て牌
          player.lizhi.ippatsu = true;
          this.io.to(myWorld.name).emit('windowUpdate', myWorld.state, myWorld.yama, myWorld.playerList);
        }
        myWorld.discardPai = player.discard(point);
        player.tehaiSort();
        myWorld.state.phase = "furoCheck";
        this.io.to(myWorld.name).emit('update', myWorld.playerList, myWorld.state);
        socket.broadcast.to(myWorld.name).emit('furoCheck', player, myWorld.discardPai);
      });

      //furoCheck後のプレイヤーの反応
      socket.on('furoReaction', () => {
        myWorld.furoState.reaction++;
        //console.log("furoReaction = " + myWorld.furoState.reaction);
        this.furoProcessing(myWorld);
      });

      //副露希望時の反応
      socket.on('furoRequest', furoAblePai => {
        myWorld.furoState.reaction++;
        myWorld.furoState.request.push({player: player.listIndex, pai: furoAblePai});
        //console.log(myWorld.furoState.reaction, myWorld.furoState.request);
        this.furoProcessing(myWorld);
      });

      //暗槓時の処理
      socket.on('ankan', kantsu => {
        player.doAnkan(kantsu);
        myWorld.yama.doraHyo[myWorld.yama.doraHyo.length - 1]++;
        myWorld.yama.uraDoraHyo[myWorld.yama.uraDoraHyo.length - 1]++;
        myWorld.yama.createDora();
        player.tehai.push(myWorld.yama.rinshan.splice(0, 1));
        myWorld.yama.haitei--;
        myWorld.haiteiCheck();
        player.tumoFlag = true;
        player.rinshanFlag = true;
        this.io.to(myWorld.name).emit('windowUpdate', myWorld.state, myWorld.yama, myWorld.playerList);
        this.io.to(myWorld.name).emit('update', myWorld.playerList, myWorld.state);
      });

      //加カン時の処理
      socket.on('kakan', kakan => {
        player.doKakan(kakan);
        myWorld.minkanFlag = true;
        player.tehai.push(myWorld.yama.rinshan.splice(0, 1));
        myWorld.yama.haitei--;
        myWorld.haiteiCheck();
        player.tumoFlag = true;
        player.rinshanFlag = true;
        //this.io.to(myWorld.name).emit('windowUpdate', myWorld.state, myWorld.yama, myWorld.playerList);
        this.io.to(myWorld.name).emit('update', myWorld.playerList, myWorld.state);
      });

      //リーチ時の処理
      socket.on('lizhi', () => {
        player.lizhi.flag = true;
        player.lizhi.num = player.sutehai.length;
        player.point -= 1000;
        myWorld.state.kyotaku++;
      });

      //ロン時の処理
      socket.on('ron', pInfo => {
        myWorld.agariPlayer = player;
        myWorld.currentPlayer.point -= pInfo.point;
        player.point += pInfo.point + myWorld.state.kyotaku * 1000 + myWorld.state.tumibo * 300;
        myWorld.state.phase = "result";
        this.io.to(myWorld.name).emit('result', pInfo, myWorld.agariPlayer, myWorld.playerList, myWorld.state, myWorld.yama);
      });

      //ツモ時の処理
      socket.on('tumo', pInfo => {
        myWorld.agariPlayer = player;
        let point;
        if(player.turn == 0) {            //親
          point = Math.ceil(pInfo.point / 3 / 10) * 10 + myWorld.state.tumibo * 100;
          point = [point, point];
        }else {                           //子
          let parent = Math.ceil(pInfo.point / 2 / 10) * 10 + myWorld.state.tumibo * 100;
          let child = Math.ceil(parent / 2 / 10) * 10 + myWorld.state.tumibo * 100;
          point = [parent, child];
        }
        pInfo.point = point;
        myWorld.playerList.forEach((value, index, array) => {
          if(value.turn == player.turn) {
            let resultPoint = pInfo.point[0] + pInfo.point[1] * 2 + myWorld.state.kyotaku * 1000;
            value.point += resultPoint;
          }else if(value.turn == 0) {
            value.point -= pInfo.point[0];
          }else {
            value.point -= pInfo.point[1];
          }
        });
        myWorld.state.phase = "result";
        this.io.to(myWorld.name).emit('result', pInfo, myWorld.agariPlayer, myWorld.playerList, myWorld.state, myWorld.yama);
      });

      //プレイヤーの反応状況
      socket.on('playerReaction', () => {
        myWorld.playerReaction++;
        //console.log("playerReaction = " + myWorld.playerReaction);
        if(myWorld.playerReaction == 4) {       //４人全員が反応を返したら局を進める
          myWorld.kyokuProceed();
          let tobi = myWorld.playerList.some(value => value.point < 0);
          if(myWorld.state.bakaze > 1 || tobi) {      //南４局が終了、または、飛んだプレイヤーがいた場合
            let rank = myWorld.shukyoku();                      //順位決め
            this.io.to(myWorld.name).emit('shukyoku', rank);    //終局処理
          }else {
            this.io.to(myWorld.name).emit('kyokuProceed', myWorld.state, myWorld.yama, myWorld.playerList);
          }
        }
      });

      //流局
      socket.on('ryukyoku', shantenCount => {
        myWorld.playerReaction++;
        player.shantenCount = shantenCount;
        //console.log("ryukyokuReaction = " + myWorld.playerReaction);
        if(myWorld.playerReaction == 4) {
          let tenpaiNum = 0;
          myWorld.playerList.forEach(value => {
            if(value.shantenCount <= 0) {
              tenpaiNum++;
            }
          });
          myWorld.playerList.forEach(value => {
            if(value.shantenCount <= 0) {
              if(tenpaiNum == 1) {value.point += 3000;}
              else if(tenpaiNum == 2) {value.point += 1500;}
              else if(tenpaiNum == 3) {value.point += 1000;}
            }else {
              if(tenpaiNum == 1) {value.point -= 1000;}
              else if(tenpaiNum == 2) {value.point -= 1500;}
              else if(tenpaiNum == 3) {value.point -= 3000;}
            }
          });
          this.io.to(myWorld.name).emit('ryukyoku', tenpaiNum, myWorld.playerList);
          myWorld.playerReaction = 0;
        }
      });

      //次のゲームに移行
      socket.on('nextGame', flag => {
        if(flag) {
          myWorld.playerReaction++;
          if(myWorld.playerReaction == 4) {
            myWorld.init();
            this.io.to(myWorld.name).emit('startInfo');
          }else {
            socket.emit('wait', player);
          }
        }else {
          this.playerDisconnect(worldList, myWorld, player);
          socket.emit('init', "始めから");
        }
      });

      //切断時の処理
      socket.on('disconnect', () => {
        this.playerDisconnect(worldList, myWorld, player);
        this.io.to(myWorld.name).emit('leaveInfo', myWorld.state);
      });
    });
  }

  //副露反応処理
  furoProcessing(myWorld) {
    if(myWorld.furoState.reaction >= 3) {
      if(myWorld.furoState.request.length > 0) {
        if(myWorld.furoState.request.length == 1) {
          myWorld.doFuro(0);
          this.io.to(myWorld.name).emit('update', myWorld.playerList, myWorld.state);
        }else {
          let priority = myWorld.decideFuroPlayer();
          myWorld.doFuro(priority);
          this.io.to(myWorld.name).emit('update', myWorld.playerList, myWorld.state);
        }
      }else {
        if(myWorld.state.haitei) {        //海底時は流局
          myWorld.state.phase = "ryukyoku";
          this.io.to(myWorld.name).emit('ryukyokuInform', myWorld.state);
        }else {
          myWorld.turnChange();
          //console.log("turnChange");
          this.io.to(myWorld.name).emit('update', myWorld.playerList, myWorld.state);
        }
      }
    }
  }

  createWorld(worldList) {
    for(let i = 0; i < worldList.length; i++) {
      if(worldList[i] === undefined) {
        let world = new World("world" + (i + 1));
        worldList[i] = world;
        return world;
      }
    }
    let world = new World("World" + (worldList.length + 1));
    worldList.push(world);
    return world;
  }

  //worldを１つ消す
  deleteWorld(worldList, world) {
    worldList.some((value, index, array) => {
      if(value.name === world.name) {
        delete array[index];
        return true;
      }
    });
  }

  //プレイヤーが切断したときの処理
  playerDisconnect(worldList, myWorld, player) {
    myWorld.leavePlayer(player.listIndex);
    if(myWorld.playerList.length <= 0) {
      this.deleteWorld(worldList, myWorld);
      return;
    }
    myWorld.init();
  }
}
