//描画関連処理
class Screen
{
  constructor(canvas, context, assets) {
    this.canvas = canvas;
    this.context = context;
    this.assets = assets;
  }

  //プレイヤーの手牌を描画
  drawPlayer(tehai, tumoFlag) {
    this.context.clearRect(Setting.pTehaiX,
                           Setting.pTehaiY - Setting.pSelectUp,
                           this.canvas.width,
                           Setting.pTehaiHeight + Setting.pSelectUp);                   //一旦消す
    for(let x = 0; x < tehai.length; x++) {
      const nx = x * Setting.pTehaiWidth + Setting.pTehaiX;
      const ny = Setting.pTehaiY;
      if(tumoFlag && x == tehai.length - 1) {
        this.drawPai(tehai[x], nx + Setting.pTumoOffset, ny, Setting.pTehaiWidth, Setting.pTehaiHeight);
        return;
      }
      this.drawPai(tehai[x], nx, ny, Setting.pTehaiWidth, Setting.pTehaiHeight);
    }
  }

  //不要牌以外を黒く描画
  drawFuyohai(tehai, fuyohai, x, y, width, height, offset) {
    let nx, ny = y;
    for(let i = 0; i < tehai.length; i++) {
      nx = x + width * i;
      if(!fuyohai.some(value => value.point == i)) {
        if(i == tehai.length - 1) {
          this.drawRect(nx + offset, ny, width, height, "fill", "rgba(0,0,0,0.5)");
        }else {
          this.drawRect(nx, ny, width, height, "fill", "rgba(0,0,0,0.5)");
        }
      }
    }
  }

  //副露牌の描画
  drawFuro(furo, playerListIndex, otherListIndex) {
    if(furo.length <= 0) {return;}                             //副露牌がなかったら何もしない
    let diff = otherListIndex - playerListIndex;               //自身と他プレイヤーとの席の位置の差
    diff = diff < 0 ? 4 + diff : diff;
    let angle;                                                 //プレイヤーごとの角度
    let startX;                                                //プレイヤーごとの開始位置x
    let startY;                                                //プレイヤーごとの開始位置y
    let drawX = 0;                                             //1牌ごとの描画開始位置x
    let drawY = 0;                                             //1牌ごとの描画開始位置y
    let width;                                                 //１牌の横幅
    let height;                                                //1牌の縦幅
    //席位置の差によって角度、開始位置、横、縦幅を変える
    if(diff == 0) {
      angle = 0;
      startX = this.canvas.width;
      startY = this.canvas.height;
      width = Setting.sutehaiWidth;
      height = Setting.sutehaiHeight;
    }else if(diff == 1) {
      angle = 270;
      startX = this.canvas.width;
      startY = 0;
      width  = Setting.sutehaiWidth;
      height = Setting.sutehaiHeight;
    }else if(diff == 2) {
      angle = 180;
      startX = 0;
      startY = 0;
      width  = Setting.sutehaiWidth;
      height = Setting.sutehaiHeight;
    }else if(diff == 3) {
      angle = 90;
      startX = 0;
      startY = this.canvas.height - 100;
      height = Setting.sutehaiHeight;
      width  = Setting.sutehaiWidth;
    }
    this.context.save();
    this.context.translate(startX, startY);
    this.context.rotate(angle * Math.PI / 180);
    this.context.clearRect(- 144, - 264, 144, 264);       //描画する場所を一旦消す
    for(let y = 0; y < furo.length; y++) {
      const f = furo[y];
      if(y != 0 && furo[y - 1].type == "kakan") {
        drawY -= width * 2;
      }else {
        drawY -= height;
      }
      for(let x = f.pai.length - 1; x >= 0; x--) {
        if(f.type == "ankan") {                     //暗槓だった場合
          if(x == f.pai.length - 1 || x == 0) {     //最初と最後は裏返す
            drawX -= width;
            this.context.translate(drawX, drawY);
            this.context.fillStyle = "purple";
            this.context.fillRect(0, 0, width, height);
            this.context.strokeStyle = "white";
            this.context.strokeRect(0, 0, width, height);
            this.context.translate(- drawX, - drawY);
          }else {
            drawX -= width;
            this.context.translate(drawX, drawY);
            this.drawPai(f.pai[x], 0, 0, width, height);
            this.context.translate(- drawX, - drawY);
          }
        }else {
          if(f.point == x) {                          //鳴いた牌だった場合に曲げる
            drawX -= height;
            drawY += height;
            this.context.translate(drawX, drawY);
            this.context.rotate(270 * Math.PI / 180);
            this.drawPai(f.pai[x], 0, 0, width, height);
            this.context.rotate(- 270 * Math.PI / 180);
            this.context.translate(- drawX, - drawY);
            if(f.type == "kakan") {
              drawY -= width;
              this.context.translate(drawX, drawY);
              this.context.rotate(270 * Math.PI / 180);
              this.drawPai(f.pai[x], 0, 0, width, height);
              this.context.rotate(- 270 * Math.PI / 180);
              this.context.translate(- drawX, - drawY);
              drawY += width;
            }
            drawY -= height;
          }else {
            drawX -= width;
            this.context.translate(drawX, drawY);
            this.drawPai(f.pai[x], 0, 0, width, height);
            this.context.translate(- drawX, - drawY);
          }
        }
      }
      drawX = 0;
    }
    this.context.restore();
  }

  //捨て牌を描画
  drawSutehai(sutehai, playerListIndex, otherListIndex, lizhi) {
    let diff = otherListIndex - playerListIndex;                //自身と他プレイヤーのプレイヤーリストのインデックス番号との差異
    diff = diff < 0 ? 4 + diff : diff;
    let angle;                                                  //捨て牌描画の角度
    let startX;                                                 //捨て牌描画の開始位置x
    let startY;                                                 //捨て牌描画の開始位置y
    if(diff == 0) {
      angle = 0;
      startX = Setting.sutehaiX;
      startY = Setting.sutehaiY;
    }else if(diff == 1) {
      angle = 270;
      startX = Setting.sutehaiX + Setting.centerWindowWidth;
      startY = Setting.sutehaiY;
    }else if(diff == 2) {
      angle = 180;
      startX = Setting.sutehaiX + Setting.centerWindowWidth;
      startY = Setting.sutehaiY - Setting.centerWindowWidth;
    }else if(diff == 3) {
      angle = 90;
      startX = Setting.sutehaiX;
      startY = Setting.sutehaiY - Setting.centerWindowWidth;
    }
    this.context.save();
    this.context.translate(startX, startY);
    this.context.rotate(angle * Math.PI / 180);
    this.context.clearRect(0, 0, Setting.centerWindowWidth, Setting.sutehaiHeight * 3);
    for(let a = 0; a < sutehai.length; a++) {
      const nx = (a % 6) * Setting.sutehaiHeight + 6;
      const ny = Math.floor(a / 6) * Setting.sutehaiHeight;
      if(lizhi.flag && lizhi.num == a) {
        this.context.translate(nx + Setting.sutehaiWidth / 2, ny + Setting.sutehaiHeight / 2);
        this.context.rotate(270 * Math.PI / 180);
        this.drawPai(sutehai[a], - (Setting.sutehaiWidth / 2), - (Setting.sutehaiHeight / 2), Setting.sutehaiWidth, Setting.sutehaiHeight);
        this.context.rotate(- 270 * Math.PI / 180);
        this.context.translate(- (nx + Setting.sutehaiWidth / 2), - (ny + Setting.sutehaiHeight / 2));
      }else {
        this.drawPai(sutehai[a], nx, ny, Setting.sutehaiWidth, Setting.sutehaiHeight);
      }
    }
    this.context.restore();
  }

  //牌を捨てる時、選択中の牌を描画
  drawSelect(tehai, point, pre, tumoFlag) {
    if(point !== null) {
      const x = Setting.pTehaiX + Setting.pTehaiWidth * point;                      //描画位置x
      const y = Setting.pTehaiY - Setting.pSelectUp;                                //描画位置y
      if(point == tehai.length - 1 && tumoFlag) {
        this.context.clearRect(x + Setting.pTumoOffset, y + Setting.pSelectUp, Setting.pTehaiWidth, Setting.pTehaiHeight);
        this.drawPai(tehai[point], x + Setting.pTumoOffset, y, Setting.pTehaiWidth, Setting.pTehaiHeight);
      }else {
        this.context.clearRect(x, y + Setting.pSelectUp, Setting.pTehaiWidth, Setting.pTehaiHeight);
        this.drawPai(tehai[point], x, y, Setting.pTehaiWidth, Setting.pTehaiHeight);
      }
    }
    if(pre !== null) {
      const px = Setting.pTehaiX + Setting.pTehaiWidth * pre;                        //描画位置x
      const py = Setting.pTehaiY;                                                    //描画位置y
      if(pre == tehai.length - 1 && tumoFlag) {
        this.context.clearRect(px + Setting.pTumoOffset, py - Setting.pSelectUp, Setting.pTehaiWidth, Setting.pTehaiHeight);
        this.drawPai(tehai[pre], px + Setting.pTumoOffset, py, Setting.pTehaiWidth, Setting.pTehaiHeight);
      }else {
        this.context.clearRect(px, py - Setting.pSelectUp, Setting.pTehaiWidth, Setting.pTehaiHeight);
        this.drawPai(tehai[pre], px, py, Setting.pTehaiWidth, Setting.pTehaiHeight);
      }
    }
  }

  //centerWindowを描画
  drawCenterWindow(worldState, doraHyo, playerList, listIndex) {
    let startX = Setting.sutehaiX;                              //centerWindowの描画位置x
    let startY = Setting.sutehaiY - Setting.centerWindowWidth;  //centerWindowの描画位置y
    let drawX;                                                  //その他の描画位置x
    let drawY;                                                  //その他の描画位置x
    //centerWindow描画
    this.context.fillStyle = "black";
    this.context.fillRect(startX, startY, Setting.centerWindowWidth, Setting.centerWindowWidth);
    //ドラ表示牌の描画
    for(let x = 0; x < 5; x++) {
      drawX = Setting.doraHyoWidth * x + startX;
      drawY = startY;
      if(x <= doraHyo[doraHyo.length - 1]) {
        this.drawPai(doraHyo[x], drawX, drawY, Setting.doraHyoWidth, Setting.doraHyoHeight);
      }else {
        this.context.strokeStyle = "white";
        this.context.strokeRect(drawX, drawY, Setting.doraHyoWidth, Setting.doraHyoHeight);
        this.context.fillStyle = "purple";
        this.context.fillRect(drawX + 1, drawY + 1, Setting.doraHyoWidth - 2, Setting.doraHyoHeight - 2);
      }
    }
    let diff;                         //席位置の差
    let textX;                        //文字の描画位置x
    let textY;                        //文字の描画位置y
    let text;                         //文字内容
    let player;                       //playerListのプレイヤーオブジェクト
    const kaze = ["東", "南", "西", "北"];          //player.turnから自風を検索
    const kyoku = ["１局", "２局", "３局", "４局"];  //state.kyokuから現在の局を検索
    //現在の局を描画
    text = kaze[worldState.bakaze] + kyoku[worldState.kyoku];
    textX = drawX + 70;
    textY = startY + 25;
    this.context.textAlign = "start";
    this.context.fillStyle = "white";
    this.context.font = Setting.pWindowFont;
    this.context.fillText(text, textX, textY);
    //供卓棒の描画
    drawX = startX + 208, drawY = startY + Setting.doraHyoHeight + 10;
    this.context.fillRect(drawX, drawY, 25, 5);
    this.context.beginPath();
    this.context.fillStyle = "red";
    this.context.arc(drawX + 12.5, drawY + 2.5, 1.5, 0, Math.PI * 2, true);
    this.context.fill();
    textX = drawX + 30, textY = drawY + 7.5, text = "× " + worldState.kyotaku;
    this.drawText(text, textX, textY, "fill", "start", "15px san-serif", "white");
    //積み棒棒の描画
    drawY = drawY + 25;
    this.context.fillRect(drawX, drawY, 25, 5);
    drawX += 8.4, drawY += 1.6;
    this.context.fillStyle = "black";
    for(let x = 0; x < 8; x++) {
      this.context.beginPath();
      this.context.arc(drawX, drawY, 0.5, 0, Math.PI * 2, true);
      this.context.fill();
      if(x % 2 == 0) {
        drawY += 1.6;
      }else if(x % 2 == 1) {
        drawX += 2.1, drawY -= 1.6;
      }
    }
    drawX = startX + 208, drawY = startY + Setting.doraHyoHeight + 35;
    textX = drawX + 30, textY = drawY + 7.5, text = "× " + worldState.tumibo;
    this.drawText(text, textX, textY, "fill", "start", "15px san-serif", "white");
    //プレイヤーごとのウィンドウを描画
    this.context.font = Setting.pWindowFont;
    for(let i = 0; i < 4; i++) {
      this.context.fillStyle = "white";
      player = playerList[i];
      diff = i - listIndex;
      diff = diff < 0 ? 4 + diff : diff;
      if(diff == 0) {
        drawX = startX + Setting.pWindowWidth / 2;
        drawY = startY + Setting.doraHyoHeight + 0.5 + Setting.pWindowHeight * 2;
      }else if(diff == 1) {
        drawX = startX + Setting.pWindowWidth;
        drawY = startY + Setting.doraHyoHeight + 0.5 + Setting.pWindowHeight;
      }else if(diff == 2) {
        drawX = startX + Setting.pWindowWidth / 2;
        drawY = startY + Setting.doraHyoHeight + 0.5;
      }else if(diff == 3) {
        drawX = startX;
        drawY = startY + Setting.doraHyoHeight + 0.5 + Setting.pWindowHeight;
      }
      //外枠を描画
      this.context.strokeStyle = "white";
      this.context.strokeRect(drawX, drawY, Setting.pWindowWidth, Setting.pWindowHeight);
      //自風を描画
      textX = drawX + 10;
      textY = drawY + 30;
      text = kaze[player.turn];
      this.context.textAlign = "start";
      this.context.fillText(text, textX, textY);
      //名前を描画
      textX = drawX + 40;
      this.context.fillText(player.name, textX, textY);
      //点数を描画
      this.context.textAlign = "center";
      text = player.point.toString();
      textX = drawX + Setting.pWindowWidth / 2;
      textY = drawY + Setting.pWindowHeight - 20;
      this.context.fillText(text, textX, textY);
      //リーチをしていたらリー棒を描画
      if(player.lizhi.flag) {
        textX -= 10
        textY += 10;
        this.context.fillRect(textX, textY, 25, 5);
        this.context.beginPath();
        this.context.fillStyle = "red";
        this.context.arc(textX + 12.5, textY + 2.5, 1.5, 0, Math.PI * 2, true);
        this.context.fill();
      }
    }
  }

  //リザルト画面の描画
  drawResult(pInfo, agariPlayer, yama, state, playerList) {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawRect(0, 0, this.canvas.width, this.canvas.height, "fill", "black");      //全体を黒く塗りつぶす
    let drawX = 0;                                                //描画開始位置x
    let drawY = 0;                                                //描画開始位置y
    let text;                                                                   //文字
    this.drawRect(drawX, drawY, this.canvas.width, 200, "fill", "#33FF00");     //上がったプレイヤーの手牌描画位置を緑に塗る
    drawX += 20, drawY += 60;
    this.drawText(agariPlayer.name, drawX, drawY, "fill", "start", "50px san-serif", "black");//名前を描画
    //ドラ表示牌の描画
    drawX += 450, drawY -= 50;
    this.drawDoraHyo(yama.doraHyo, drawX, drawY, Setting.doraHyoWidth, Setting.doraHyoHeight);
    //裏ドラ表示牌の描画
    drawY += 40;
    if(pInfo.yaku.some(value => value == "立直" || value == "ダブル立直")) {
      this.drawDoraHyo(yama.uraDoraHyo, drawX, drawY, Setting.doraHyoWidth, Setting.doraHyoHeight);
    }
    //供託棒の描画
    drawX += 158, drawY -= 5, text = "供卓棒 × " + state.kyotaku;
    this.drawText(text, drawX, drawY, "fill", "start", "25px san-serif", "black");
    //積み棒の描画
    drawY += 35, text = "積み棒 × " + state.tumibo;
    this.drawText(text, drawX, drawY, "fill", "start", "25px san-serif", "black");
    //上がったプレイヤーの手牌を描画
    let noTumo;                     //ツモ牌のない手牌を作成
    if(pInfo.value == "ツモ") {
      noTumo = agariPlayer.tehai.filter((value, index, array) => {
        return index != array.length - 1;
      });
    }else if(pInfo.value == "ロン") {
      noTumo = agariPlayer.tehai;
    }
    drawX = Setting.pTehaiX, drawY = 120;
    for(let x = 0; x <= noTumo.length; x++) {
      if(x == noTumo.length) {
        drawX += Setting.pTumoOffset;
        this.drawPai(pInfo.atarihai, drawX, drawY, Setting.pTehaiWidth, Setting.pTehaiHeight);
      }else {
        this.drawPai(noTumo[x], drawX, drawY, Setting.pTehaiWidth, Setting.pTehaiHeight);
      }
      drawX += Setting.pTehaiWidth;
    }
    //副露牌の描画
    if(agariPlayer.furo.length > 0) {
      drawX += Setting.pTumoOffset, drawY += Setting.pTehaiHeight - Setting.sutehaiHeight;
      this.drawFurohai(agariPlayer.furo, drawX, drawY, Setting.sutehaiWidth, Setting.sutehaiHeight, 30);
    }
    //役の描画
    drawX = 50, drawY = 250;
    for(let i = 0; i < pInfo.yaku.length; i++) {
      text = pInfo.yaku[i];
      this.drawText(text, drawX, drawY, "fill", "start", "30px san-serif", "white");
      drawY += 40;
      if(i == 5 || i == 11) {drawX += 210, drawY = 250;}
    }
    //飜数、符数の描画
    //飜と符からtextに代入する文字を決める
    if(pInfo.han <= 4) {
      if(pInfo.han == 3 && pInfo.fu >= 60 && pInfo.fu <= 110) {         //３飜６０符～１１０符なら満貫
        text = "満貫";
      }else if(pInfo.han == 4 && pInfo.fu >= 30 && pInfo.fu <= 110) {   //４飜３０符～１１０符なら満貫
        text = "満貫";
      }else {                                                           //それ以外なら飜数、符数
        text = pInfo.fu + "符 " + pInfo.han + "飜";
      }
    }
    if(pInfo.han >= 5 && pInfo.han < 6) {text = "満貫";}
    if(pInfo.han >= 6 && pInfo.han < 8) {text = "跳満";}
    if(pInfo.han >= 8 && pInfo.han < 11) {text = "倍満";}
    if(pInfo.han >= 11 && pInfo.han < 13) {text = "三倍満";}
    if(pInfo.han >= 13) {text = "役満";}
    drawX = 550, drawY = 400;
    this.drawText(text, drawX, drawY, "fill", "start", "40px san-serif", "white");        //飜数、符数を描画
    //点数の描画
    drawY = 450;
    let point;                    //点数の合計
    let ron;                      //ロンかツモかの判定
    if(Array.isArray(pInfo.point)) {          //ツモ
      point = pInfo.point[0] + pInfo.point[1] * 2;
      ron = false;
    }else {                                   //ロン
      point = pInfo.point;
      ron = true;
    }
    text = point + "点";
    this.drawText(text, drawX, drawY, "fill", "start", "40px san-serif", "white");
    //プレイヤーウィンドウの描画
    //上がったプレイヤー
    drawX = 50, drawY = 550;
    let width = 135, height = 150;        //縦幅、横幅
    this.drawPlayerWindow(agariPlayer, drawX, drawY, width, height, 20);
    text = "+" + point;
    let textX = drawX + width / 2, textY = drawY + height / 2 + 10;     //点数の＋－描画位置
    this.drawText(text, textX, textY, "fill", "center", "25px san-serif", "white");
    //その他のプレイヤー
    for(let i = 0; i < playerList.length; i++) {
      let player = playerList[i];
      if(player.turn == agariPlayer.turn) {continue;}     //上がったプレイヤーと同じプレイヤーのときは飛ばす
      drawX += width + 50;
      this.drawPlayerWindow(player, drawX, drawY, width, height, 20);
      textX = drawX + width / 2;
      if(ron) {               //ロン
        if(player.turn == state.turn) {       //振り込んだプレイヤーだけマイナス
          text = "-" + point;
        }else {
          text = "+-0";
        }
      }else {                 //ツモ
        if(player.turn == 0) {    //親の場合は倍の支払い(pInfo.point[0]に格納)
          text = "-" + pInfo.point[0];
        }else {                   //子の場合は親の半額(pInfo.point[1]に格納)
          text = "-" + pInfo.point[1];
        }
      }
      this.drawText(text, textX, textY, "fill", "center", "25px san-serif", "white");
    }
  }

  //流局画面の描画
  drawRyukyoku(tenpaiNum, playerList) {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawRect(0, 0, this.canvas.width, this.canvas.height, "fill", "black");
    this.drawText("流局", this.canvas.width / 2, 300, "fill", "center", "50px san-serif", "white");
    let width = 135, height = 150, x = 50, y = 400;       //プレイヤーウィンドウ用変数
    let text, tx, ty = y + height / 2 + 10;               //加点、減点の描画用変数
    let gain = 0, lost = 0;                               //gain->テンパイ者の獲得点、lost->非テンパイ者の減点
    if(tenpaiNum == 1) {gain = 3000, lost = 1000;}
    else if(tenpaiNum == 2) {gain = 1500, lost = 1500;}
    else if(tenpaiNum == 3) {gain = 1000, lost = 3000;}
    for(let i = 0; i < playerList.length; i++) {
      let player = playerList[i];
      this.drawPlayerWindow(player, x, y, width, height, 20);
      if(tenpaiNum == 0 || tenpaiNum == 4) {
        text = "+-" + 0;
      }else {
        if(player.shantenCount <= 0) {
          text = "+" + gain;
        }else {
          text = "-" + lost;
        }
      }
      tx = x + width / 2;
      this.drawText(text, tx, ty, "fill", "center", "25px san-serif", "white");
      x += width + 50;
    }
  }

  //終局画面の描画
  drawShukyoku(rank, listIndex) {
    this.context.clearRect(0, 0 , this.canvas.width, this.canvas.height);         //一旦消す
    this.drawRect(0, 0, this.canvas.width, this.canvas.height, "fill", "black");  //canvasを黒く塗る
    this.drawText("終局", this.canvas.width / 2, 150, "fill", "center", "50px san-serif", "white");   //終局表示
    let text, x, y, width, height = 50, color;
    for(let i = 0; i < rank.length; i++) {
      if(rank[i].listIndex == listIndex) {color = "red";}     //自身の場合は赤色で描画
      else {color = "white";}                                 //それ以外は白
      text = i + 1 + "位";
      x = 150, y = height * i + 230;
      this.drawText(text, x, y, "fill", "start", "30px san-serif", color);      //順位
      text = rank[i].name;
      x += 150;
      this.drawText(text, x, y, "fill", "start", "30px san-serif", color);      //名前
      text = rank[i].point + "点";
      x += 200;
      this.drawText(text, x, y, "fill", "start", "30px san-serif", color);      //点数
    }
  }

  //副露牌の描画
  drawFurohai(furoList, x, y, width, height, offset) {
    for(let i = 0; i < furoList.length; i++) {
      furo = furoList[i];
      for(let j = 0; j < furo.pai.length; j++) {
        if(furo.type == "ankan") {
          if(j == 0 || j == furo.pai.length - 1) {
            this.drawRect(x, y, width, height, "fill", "purple");
          }else {
            this.drawPai(furo.pai[j], x, y, width, height);
          }
          x += width;
        }else {
          if(furo.point == j) {
            y += height;
            this.context.translate(x, y);
            this.context.rotate(270 * Math.PI / 180);
            this.drawPai(furo.pai[j], 0, 0, width, height);
            this.context.rotate(- 270 * Math.PI / 180);
            this.context.translate(- x, - y);
            if(furo.type == "kakan") {
              y -= width;
              this.context.translate(x, y);
              this.context.rotate(270 * Math.PI / 180);
              this.drawPai(furo.pai[j], 0, 0, width, height);
              this.context.rotate(- 270 * Math.PI / 180);
              this.context.translate(- x, - y);
              y += width;
            }
            y -= height;
            x += height;
          }else {
            this.drawPai(furo.pai[j], x, y, width, height);
            x += width;
          }
        }
      }
      x += offset;
    }
  }

  //ドラ表示牌の描画
  drawDoraHyo(doraHyo, x, y, width, height) {
    for(let i = 0; i < 5; i++) {
      if(i <= doraHyo[doraHyo.length - 1]) {
        this.drawPai(doraHyo[i], x, y, width, height);
      }else {
        this.drawRect(x, y, width, height, "stroke", "white");
        this.drawRect(x + 1, y + 1, width - 2, height - 2, "fill", "purple");
      }
      x += width;
    }
  }

  //プレイヤーウィンドウの描画
  drawPlayerWindow(player, x, y, width, height, textSize) {
    const kaze = ["東", "南", "西", "北"];
    let text = kaze[player.turn];
    let size = textSize + "px san-serif";
    let drawX = x, drawY = y;
    this.drawRect(drawX, drawY, width, height, "stroke", "white");      //外枠の描画
    drawX += 10, drawY += 30;
    this.drawText(text, drawX, drawY, "fill", "start", size, "white");    //自風の描画
    text = player.name;
    drawX += 30;
    this.drawText(text, drawX, drawY, "fill", "start", size, "white");    //名前の描画
    text = player.point.toString();
    drawX = x + width / 2, drawY = y + height - 20;
    this.drawText(text, drawX, drawY, "fill", "center", size, "white");    //点数の描画
  }

  //アニメーション
  animate(text) {
    return new Promise(resolve => {
      let frame = 0;
      let animation = () => {
        this.context.clearRect(0, 250, this.canvas.width, 300);
        this.drawRect(0, 250, this.canvas.width, 300, "fill", "black");
        let x = 100 + 10 * frame > this.canvas.width / 2 ? this.canvas.width / 2 : 100 + 10 * frame;
        this.drawText(text, x, 450, "fill", "center", "100px san-serif", "white");
        frame++;
        if(frame < 60) {
          setTimeout(animation, 30);
        }else {
          resolve(text);
        }
      }
      animation();
    });
  }

  //矩形の描画
  drawRect(x, y, width, height, form, color) {
    if(form == "fill") {
      this.context.fillStyle = color;
      this.context.fillRect(x, y, width, height);
    }else if(form == "stroke") {
      this.context.strokeStyle = color;
      this.context.strokeRect(x, y, width, height);
    }
  }

  //文字の描画
  drawText(text, x, y, form, align, font, color) {
    this.context.textAlign = align;
    this.context.font = font;
    if(form == "fill") {
      this.context.fillStyle = color;
      this.context.fillText(text, x, y);
    }else if(form == "stroke") {
      this.contetx.strokeStyle = color;
      this.context.strokeText(text, x, y);
    }
  }

  //1牌の描画
  drawPai(index, x, y, width, height) {
    const iw = Setting.paiImageWidth;
    const ih = Setting.paiImageHeight;
    const ix = (index % 10) * iw;                     //indexからx軸の位置を計算
    const iy = Math.floor(index / 10) * ih;           //indexからy軸の位置を計算
    this.context.drawImage(this.assets.pai, ix, iy, iw, ih, x, y, width, height);
  }
}

//画像関連読み込み
class Assets
{
  constructor() {
    //this.pai = this.loadImage("./img/pai.png");
    this.pai = new Image();
    this.pai.src = "./img/pai.png";
  }

  /*loadImage(url) {
    return new Promise(resolve => {
      const image = new Image();
      image.addEventListener('load', () => {
        console.log("画像読み込み完了");
        resolve(image);
      }, false);
      image.src = url;
    });
  }*/
}
