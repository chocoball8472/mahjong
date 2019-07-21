class Setting
{
  static get paiImageWidth() {return 44}             //pai.pngの１牌の横幅

  static get paiImageHeight() {return 60}            //pai.pngの１牌の縦幅

  static get pTehaiX() {return 72}                   //プレイヤー手牌の描画開始位置ｘ

  static get pTehaiY() {return 740}                  //プレイヤー手牌の描画開始位置ｙ

  static get pTumoX() {return 700}                   //プレイヤーの自摸牌の描画開始位置x

  static get pTumoOffset() {return 30}               //手牌と自摸牌の間隔

  static get pSelectUp() {return 20}                 //選択している牌をどれだけ浮かせるか

  static get pTehaiWidth() {return 44}               //プレイヤー手牌の１牌の横幅

  static get pTehaiHeight() {return 60}              //プレイヤー手牌の１牌の縦幅

  static get sutehaiX() {return 265}                 //捨て牌の描画開始位置x

  static get sutehaiY() {return 535}                 //捨て牌の描画開始位置y

  static get sutehaiWidth() {return 33}              //捨て牌１牌の横幅

  static get sutehaiHeight() {return 45}             //捨て牌１牌の縦幅

  static get centerWindowWidth() {return 270}         //真ん中のウィンドウの幅（縦、横の長さは同じ）

  static get pWindowWidth() {return 135}               //プレイヤーウィンドウの横幅

  static get pWindowHeight() {return 77}              //プレイヤーウィンドウの縦幅

  static get pWindowFont() {return "20px san-serif"}  //プレイヤーウィンドウの文字設定

  static get doraHyoWidth() {return 27.5}             //ドラ表示牌の横幅

  static get doraHyoHeight() {return 37.5}            //ドラ表示牌の縦幅

  static get resultX() {return 0}                     //リザルト画面の描画開始位置x

  static get resultY() {return 100}                   //リザルト画面の描画開始位置y

  //panelクラスの設定
  static get panelPartsOffset() {return 5}          //部品（ボタンなど）間隔

  static get panelButtonWidth() {return 100}        //ボタンの横幅

  static get panelButtonHeight() {return 50}        //ボタンの縦幅

  static get panelButtonFont() {return "bold 25px san-serif"}         //ボタンの文字設定

  static get panelCancelButtonFont() {return "bold 18px san-serif"}   //キャンセルボタンの文字設定

  static get panelButtonFontOffset() {return 15}    //ボタンの文字の描画間隔

  static get panelFuroPaiOffset() {return 10}       //副露可能牌描画のの間隔

  static get panelFuroWidth() {return 96}           //副露組み合わせ選択範囲の横幅

  static get panelFuroHeight() {return 65}          //副露組み合わせ選択範囲の縦幅

  static get panelFuroPaiWidth() {return 33}        //副露可能牌の横幅

  static get panelFuroPaiHeight() {return 45}       //副露可能牌の縦幅
}
