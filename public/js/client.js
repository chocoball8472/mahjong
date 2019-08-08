const socket = io(location.origin, {
  transports: ['websocket'],
});                                //socket.io接続

const canvas = document.getElementById("canvas");   //canvas要素の取得
const context = canvas.getContext("2d");             //2dcontextの取得

const assets = new Assets();                                //Assetsインスタンスの生成
const screen = new Screen(canvas, context, assets);         //Screenインスタンスの生成
const calculation = new Calculation();                      //Calculationインスタンスの生成
const panel = new Panel("panel", assets);                   //Panelインスタンスの生成
const information = new Information("wrapper");             //Informationインスタンスの生成

//サーバとの通信処理
//接続時の処理
socket.on('connect', () => {
  socket.emit('connectRequest');              //接続成功か確認
});

//接続確認
socket.on('init', message => {
  showInformation();
  information.nickname(name => {
    socket.emit('entry', name);               //ワールドに入室
  });
});

//入室確認
socket.on('entryConfirm', name => {
  console.log(name + "に入室しました。");
});

//待機状態
socket.on('wait', player => {
  information.remove(information.wrapper, information.self);
  showInformation();
  information.message("待機中...");
});

//対局開始の知らせを受け取る
socket.on('startInfo', () => {
  //console.log("対局開始");
  information.remove(information.wrapper, information.self);
  screen.animate("対局開始").then(text => {
    socket.emit('start');
  });
});

//ゲーム開始処理
let player;                               //サーバ側の自身のプレイヤーインスタンスをコピー
let state;                                //ワールドの状況
let lizhiState = 0;                  　　 //立直の状況 0->立直していない、1->立直ボタン押した直後、2->立直ボタンをおして牌を捨てた後
socket.on('start', (worldState, yama, playerList, listIndex) => {
  kyokuStart(worldState, yama, playerList, listIndex);
});

//局の進行処理
socket.on('kyokuProceed', (worldState, yama, playerList) => {
  kyokuStart(worldState, yama, playerList, player.listIndex);
});

function kyokuStart(worldState, yama, playerList, listIndex) {
  context.clearRect(0, 0, canvas.width, canvas.height);
  panel.init();
  //初期化
  lizhiState = 0;
  //playerとstateの更新
  player = Object.assign({}, playerList[listIndex]);
  state = Object.assign({}, worldState);
  //ドラと裏ドラの更新
  calculation.dora = yama.dora.concat();
  calculation.uraDora = yama.uraDora.concat();
  //描画
  screen.drawPlayer(player.tehai, player.tumoFlag);
  screen.drawCenterWindow(state, yama.doraHyo, playerList, listIndex);
  //自身が親だった場合（ツモした場合）
  if(listIndex == 0) {
    //ツモ牌を抜いた状態の手牌を作成
    let parentTehai = player.tehai.filter((value, index, array) => {
      return index != array.length - 1;
    });
    //ツモ牌を抜いた状態の手牌でテンパイか確認
    calculation.startShantenCount(parentTehai, player.furo);
    if(calculation.shantenCount == 0) {
      calculation.agarihaiSearch(parentTehai, player.furo);
    }
    tumoProcessing();
  }else {   //子だった場合
    calculation.startShantenCount(player.tehai, player.furo);
    if(calculation.shantenCount == 0) {
      calculation.agarihaiSearch(player.tehai, player.furo);
    }
  }
}

//centerWindowの更新
socket.on('windowUpdate', (worldState, yama, playerList) => {
  state = Object.assign({}, worldState);
  calculation.dora = yama.dora.concat();
  calculation.uraDora = yama.uraDora.concat();
  screen.drawCenterWindow(state, yama.doraHyo, playerList, player.listIndex);
});

//全体の情報の更新
socket.on('update', (playerList, worldState) => {
  player = Object.assign({}, playerList[player.listIndex]);
  state = Object.assign({}, worldState);
  screen.drawPlayer(player.tehai, player.tumoFlag);
  for(let x = 0; x < playerList.length; x++) {
    let other = playerList[x];
    screen.drawSutehai(other.sutehai, player.listIndex, other.listIndex, other.lizhi);
    screen.drawFuro(other.furo, player.listIndex, other.listIndex);
  }
  //ツモ時の処理
  tumoProcessing();
});

//ツモしたときと一連の処理
function tumoProcessing() {
  //自摸時の処理
  let tumoPoint = player.tehai.length - 1;                  //自摸牌の場所
  let tumohai = player.tehai[player.tehai.length - 1];      //自摸牌
  if(state.phase == "discard") {
    //リーチをしていなかった場合
    if(player.turn == state.turn && !player.lizhi.flag) {
      calculation.furiten = false;                      //フリテン判定をfalseに
      if(calculation.agarihai.length > 0) {             //テンパイ時は上がり確認
        if(calculation.agariCheck(tumohai)) {
          calculation.ron = false;
          calculation.startPoint(player, tumohai, state);
          if(calculation.han > 0) {
            panel.createButton(panel.buttonType.tumo, () => {
              agariProcessing('tumo');
            });
          }
        }
      }
      //シャン点数の計算
      let shantenCount = calculation.startShantenCount(player.tehai, player.furo);
      if(!state.haitei) {         //海底ではなかったら
        //暗槓できるかチェック
        let kantsu = calculation.ankanCheck();
        if(kantsu.length > 0) {
          panel.createButton(panel.buttonType.ankan, () => {
            panel.createFuroSelect(kantsu, pai => {
              socket.emit('ankan', pai);
            });
          });
        }
        //加カンできるかチェック
        if(player.furo.length > 0) {
          let kakan = calculation.kakanCheck(player.furo, player.tehai);
          if(kakan.length > 0) {
            panel.createButton(panel.buttonType.kakan, () => {
              panel.createFuroSelect(kakan, pai => {
                console.log("kakan = " + kakan);
                socket.emit('kakan', pai);
              });
            });
          }
        }
        //テンパイで鳴いてないときはリーチボタンを生成
        if(shantenCount <= 0 && player.furo.length == 0) {
          panel.createButton(panel.buttonType.lizhi, () => {
            lizhiState = 1;
            calculation.fuyohaiSearch(player.tehai, player.furo);
            screen.drawFuyohai(player.tehai,
                               calculation.fuyohai,
                               Setting.pTehaiX,
                               Setting.pTehaiY,
                               Setting.pTehaiWidth,
                               Setting.pTehaiHeight,
                               Setting.pTumoOffset);
            socket.emit('lizhi');
          });
        }
      }
      if(panel.buttonState.num) {        //パネルにボタンが生成されていたらキャンセルボタンを生成
        panel.createButton(panel.buttonType.cancel, () => {
          console.log("キャンセル");
        });
      }
      //リーチ時
    }else if(player.turn == state.turn && player.lizhi.flag) {
      if(calculation.agariCheck(tumohai)) {                     //上がりだった場合
        calculation.ron = false;
        calculation.startPoint(player, tumohai, state)
        if(calculation.han > 0) {
          panel.createButton(panel.buttonType.tumo, () => {
            agariProcessing('tumo', tumohai);
          });
          panel.createButton(panel.buttonType.cancel, () => {
            socket.emit('discard', tumoPoint);
          });
        }
      }else {                                                  //上がりではなかった場合
        let kantsu = calculation.ankanCheckafterLizhi(player.tehai, tumohai);     //暗槓できるか調べる
        if(kantsu > 0) {                                                          //暗槓できたら
          panel.createButton(panel.buttonType.ankan, () => {
            panel.createFuroSelect(kantsu, pai => {
              socket.emit('ankan', pai);
            });
          });
          panel.createButton(panel.buttonType.cancel, () => {
            socket.emit('discard', tumoPoint);
          });
        }else {                                                                  //暗槓できなかったら
          socket.emit('discard', tumoPoint);
        }
      }
    }
    //自分が捨てた後テンパイだったら上がり牌を探す
  }else if(state.phase == "furoCheck" && lizhiState != 2) {
    if(player.turn == state.turn) {
      if(calculation.shantenCount <= 0) {
        calculation.agarihaiSearch(player.tehai, player.furo);
        if(player.lizhi.flag) {
          lizhiState = 2;
        }
      }
    }
  }
}

//牌を捨てた後鳴けるか確認
socket.on('furoCheck', (discardPlayer, discardPai) => {
  let ronFlag = false;
  //リーチは上がりかどうかだけ判定
  if(player.lizhi.flag) {
    if(calculation.agariCheck(discardPai)) {      //上がり牌だった場合
      if(calculation.furitenCheck(player.sutehai)) {      //フリテンか確認
        calculation.ron = true;
        calculation.startPoint(player, discardPai, state);
        if(calculation.han > 0) {
          panel.createButton(panel.buttonType.ron, () => {
            agariProcessing('ron');
          });
          panel.createButton(panel.buttonType.cancel, () => {
            calculation.furiten = true;             //フリテン判定をtrueに
            socket.emit('furoReaction');
          });
        }
      }else {             //上がり牌だがフリテンだった場合
        socket.emit('furoReaction');      //furoReactionだけ送信
      }
    }else {               //上がり牌ではなかった場合
      socket.emit('furoReaction');    //furoReactionだけ送信
    }
    return;
  }else {               //非リーチ時にテンパイしていたら上がり牌か調べる
    if(calculation.agarihai.length > 0) {
      ronFlag = calculation.agariCheck(discardPai);
      if(ronFlag) {
        if(calculation.furitenCheck(player.sutehai)) {      //フリテンか確認
          calculation.ron = true;
          calculation.startPoint(player, discardPai, state);
          if(calculation.han > 0) {
            panel.createButton(panel.buttonType.ron, () => {
              agariProcessing('ron');
            });
          }
        }
      }
    }
    //副露可能の牌があるかチェック
    if(!state.haitei) {         //海底ではなかったら
      let furoAblePai = calculation.furoCheck(player, discardPai, discardPlayer);
      if(furoAblePai.length > 0) {
        panel.createButton(panel.buttonType.furo, () => {
          panel.createFuroSelect(furoAblePai, pai => {
            socket.emit('furoRequest', pai);
          });
        });
      }
    }
    //ロンか副露ができるときはキャンセルボタンを生成
    if(panel.buttonState.num) {
      panel.createButton(panel.buttonType.cancel, () => {
        if(panel.handler.getKeyNumber(panel.buttonType.ron.key) == panel.buttonType.ron.key) {
          calculation.furiten = true;
        }
        socket.emit('furoReaction');
      });
    }else {
      socket.emit('furoReaction');
    }
  }
});

//誰かが上がった時の処理
socket.on('result', (pInfo, agariPlayer, playerList, worldState, yama) => {
  panel.init();       //panelの初期化
  //player,stateの更新
  player = Object.assign({}, playerList[player.listIndex]);
  state = Object.assign({}, worldState);
  screen.animate(pInfo.value).then(text => {
    screen.drawResult(pInfo, agariPlayer, yama, state, playerList);   //リザルト画面の描画
    let pressFlag = false;      //スキップボタンを押したか判定
    panel.createButton(panel.buttonType.skip, () => {                 //スキップボタンの生成
      socket.emit('playerReaction');                                  //反応を返す
      pressFlag = true;
    });
    setTimeout(() => {                             //スキップボタンを押していなくても５秒たったら反応を返す
      if(!pressFlag) {socket.emit('playerReaction');}
      //panel.init();                                //panelを初期化
    }, 5000);
    return text;
  });
});

//上がり時の処理
function agariProcessing(ron) {
  let value;
  if(ron == 'ron') {
    value = "ロン";
  }else if(ron == 'tumo') {
    value = "ツモ";
  }
  //calulation.startPoint(player, atarihai, state);
  let pInfo = {
    point: calculation.point,
    han: calculation.han,
    fu: calculation.fu,
    yaku: calculation.yakuName,
    value: value,
    atarihai: calculation.atarihai
  };
  socket.emit(ron, pInfo);
}

//ryukyokuInform時にシャン点数を返す
socket.on('ryukyokuInform', worldState => {
  panel.init();
  state.phase = worldState.phase;
  socket.emit('ryukyoku', calculation.shantenCount);
});

//流局時の処理
socket.on('ryukyoku', (tenpaiNum, playerList) => {
  player = Object.assign({}, playerList[player.listIndex]);
  screen.drawRyukyoku(tenpaiNum, playerList);
  panel.createButton(panel.buttonType.skip, () => {
    socket.emit('playerReaction');
  });
});

//終局時の処理
socket.on('shukyoku', rank => {
  screen.drawShukyoku(rank, player.listIndex);
  panel.init();
  panel.createButton(panel.buttonType.skip, () => {
    showInformation();
    information.nextGameSelect(flag => {
      socket.emit('nextGame', flag);
    });
  });
});

//退席者が出た時の処理
socket.on('leaveInfo', worldState => {
  state = Object.assign({}, worldState);
  let promise = new Promise(resolve => {
    showInformation();
    information.message("1人のプレイヤーが退席しました。");
    setTimeout(() => {
      resolve("3秒経過");
    }, 3000);
  });
  promise.then(text => {
    information.message("待機中...");
  });
});

//informationを表示する
function showInformation() {
  panel.init();
  screen.context.clearRect(0, 0, screen.canvas.width, screen.canvas.height);
  information.append(information.wrapper, information.self);
}

//イベント処理
//クリックイベント
let select = createSelect();               //クリックした手牌の位置x
canvas.addEventListener('click', event => {
  if(player.turn != state.turn || state.phase != "discard" || panel.operate || player.lizhi.flag) {
    return;
  }
  fixPoint(event);
  if(select.flag) {
    if(lizhiState == 1) {         //立直ボタン押した後の捨て牌選択
      collisionAction(true, calculation.fuyohai);
    }else {                       //通常時
      collisionAction(false, calculation.fuyohai);
    }
  }else {
    screen.drawSelect(player.tehai, select.point, select.pre, player.tumoFlag);
  }
}, false);

//クリックした座標を特定
function fixPoint(event) {
  const rect = canvas.getBoundingClientRect();
  let mx = event.pageX - rect.left;
  let my = event.pageY - rect.top;

  clickCollision(mx, my, player.tehai, player.tumoFlag);

  //console.log("select.flag = " + select.flag, "select.point = " + select.point, "select.pre = " + select.pre);
}

//
function createSelect() {
  return {
    flag: false,
    point: null,
    pre: null
  };
}

//牌を捨てる
function discard() {
  socket.emit('discard', select.point);
  select = createSelect();
}

//クリックした手牌との当たり判定
function clickCollision(mx, my, tehai, tumoFlag) {
  if(my >= Setting.pTehaiY) {
    for(let x = 0; x < tehai.length; x++) {
      if(tumoFlag && x == tehai.length - 1) {
        if(mx >= Setting.pTehaiX + Setting.pTehaiWidth * x + 30//Setting.pTumoOffset
          && mx < Setting.pTehaiX + Setting.pTehaiWidth * (x + 1) + 30) {
          select.flag = true;
          select.pre = select.point;
          select.point = x;
          return;
        }
      }else {
        if(mx >= Setting.pTehaiX + Setting.pTehaiWidth * x
          && mx < Setting.pTehaiX + Setting.pTehaiWidth * (x + 1)) {
          select.flag = true;
          select.pre = select.point;
          select.point = x;
          return;
        }
      }
    }
    select.flag = false;
    select.pre = select.point;
    select.point = null;
    return;
  }
  select.flag = false;
  select.pre = select.point;
  select.point = null;
  return;
}

//clickCollision後の動き
function collisionAction(lizhi, fuyohai) {         //立直ボタンを押した後はtrue,それ以外はfalse
  if(lizhi) {
    if(fuyohai.some(value => value.point == select.point)) {
      if(select.pre == select.point) {
        discard();
      }else if(select.pre != select.point) {
        screen.drawSelect(player.tehai, select.point, select.pre, player.tumoFlag);
      }
    }else {
      select.point = null;
      screen.drawSelect(player.tehai, select.point, select.pre, player.tumoFlag);
    }
  }else {
    if(select.pre == select.point) {
      discard();
    }else if(select.pre != select.point) {
      screen.drawSelect(player.tehai, select.point, select.pre, player.tumoFlag);
    }
  }
}
