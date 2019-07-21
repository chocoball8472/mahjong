const ca = document.getElementById("canvas");
const g  = ca.getContext("2d");

function loadImage(url) {
  return new Promise(resolve => {
    const image = new Image();
    image.src = url;
    image.addEventListener("load", () => {
      console.log("画像の読み込みが完了しました。")
      resolve(image);
    }, false);
  });
}

loadImage('./img/pai.png')
.then(image => {
  g.drawImage(image, 44, 0, 44, 60, 100, 100, 55, 75);
  return image;
}).then(image => {
  image.addEventListener("click", (event) => {
    console.log("クリックされました。");
  }, false);
});
