class Information
{
  constructor(wrapper) {
    this.wrapper = document.getElementById(wrapper);
    this.self = document.createElement('div');
    this.style = {
      position: "absolute",
      top: "0px",
      width: "800px",
      height: "800px",
      background: "rgba(0,0,0,0.4)",
    };
    for(let key in this.style) {
      this.self.style[key] = this.style[key];
    }
  }

  append(parent, child) {
    parent.appendChild(child);
  }

  remove(parent, child) {
    parent.removeChild(child);
  }

  clear() {
    let count = 0;
    while(this.self.firstChild) {
      this.self.removeChild(this.self.firstChild);
      count++;
      if(count > 10) {
        console.log("無限ループ");
        break;
      }
    }
  }

  message(text) {
    this.clear();
    let frame = this.createFrame(250, 300, 300, 200);
    let message = this.createMessage(text);
    this.append(frame, message);
    this.append(this.self, frame);
  }

  nickname(callback) {
    this.clear();
    let frame = this.createFrame(250, 300, 300, 200);
    let message = this.createMessage("ニックネームを入力してください。");
    let form = document.createElement('form');
    let nameArea = document.createElement('input');
    nameArea.type = "text";
    nameArea.maxLength = "9";
    nameArea.size = "15";
    let button = this.createButton("submit", () => {
      callback(nameArea.value);
    });
    this.append(form, nameArea);
    this.append(form, button);
    this.append(frame, message);
    this.append(frame, form);
    this.append(this.self, frame);
  }

  nextGameSelect(callback) {
    this.clear();
    let frame = this.createFrame(250, 300, 300, 200);
    let message = this.createMessage("ゲームを続けますか？");
    let form = document.createElement('form');
    let flag;
    let next = this.createButton("続ける", () => {
      flag = true;
      callback(flag);
    });
    let cancel = this.createButton("キャンセル", () => {
      let flag = false;
      callback(flag);
    });
    cancel.style.marginLeft = "40px";
    this.append(form, next);
    this.append(form, cancel);
    this.append(frame, message);
    this.append(frame, form);
    this.append(this.self, frame);
  }

  createFrame(x, y, width, height) {
    let frame = document.createElement('div');
    let style = {
      position: "absolute",
      width: width + "px",
      height: height + "px",
      left: x + "px",
      top: y + "px",
      background: "rgba(0,0,0,0.2)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center"
    };
    for(let key in style) {
      frame.style[key] = style[key];
    }
    return frame;
  }

  createMessage(text) {
    let message = document.createElement('p');
    message.style.textAlign = "center";
    message.style.color = "white";
    message.textContent = text;
    return message;
  }

  createButton(value, callback) {
    let button = document.createElement('input');
    button.type = "button";
    button.value = value;
    button.style.marginLeft = "5px";
    button.onclick = () => {
      callback();
    }
    return button;
  }
}
