//モジュール
const express = require('express');
const http = require('http');
const Game = require('./server/game.js');

//オブジェクト
const app = express();
const server = http.createServer(app);
const io = require('socket.io').listen(server, {
  transports: ['websocket'],
});

const port = process.env.PORT || 3000;            //ポート番号

app.use(express.static(__dirname + '/public'));   //公開フォルダの指定

//サーバー起動
server.listen(port, () => {
  console.log("server is running");
});

//ゲーム起動
const game = new Game(io);
game.startUp();
