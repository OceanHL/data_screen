/*
 * @Author: jhl
 * @Date: 2021-11-12 20:12:11
 * @LastEditors: jhl
 * @LastEditTime: 2021-11-13 11:13:10
 * @Description:
 */
export default class SocketService {
  /* 
      单例
  */
  static instance = null;
  static get Instance() {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  // 和服务端连接的 socket 对象
  ws = null;

  // 存储回调函数
  callBackMapping = {};

  // 标识是否连接成功
  connected = false;

  // 记录重试的次数
  sendRetryCount = 0;

  // 重新连接尝试的次数
  connectRetryCount = 0;

  // 定义连接服务器的方法
  connect() {
    // 连接服务器
    if (!window.WebSocket) {
      return console.log("您的浏览器不支持 WebSocket ");
    }
    this.ws = new WebSocket("ws://localhost:9998");

    // 连接成功的事件
    this.ws.onopen = () => {
      console.log("连接服务端成功了");
      this.connected = true;
      // 重置重新连接的次数
      this.connectRetryCount = 0;
    };
    // 连接服务器端失败
    this.ws.onclose = () => {
      console.log("连接服务端失败");
      this.connected = false;
      this.connectRetryCount++;
      setTimeout(() => {
        this.connect(); // 重新连接
      }, this.connectRetryCount * 500);
    };
    // 得到服务端发送过来的数据
    this.ws.onmessage = msgEv => {
      console.log("从服务端获取了数据", msgEv);
      // 真正从服务端发送过来的原始数据在 msg 中的 data 字段
      const recvData = JSON.parse(msgEv.data);
      console.log("recvData", recvData);
      const socketType = recvData.socketType;
      // 判断回调函数是否存在
      if (this.callBackMapping[socketType]) {
        const action = recvData.action;
        if (action === "getData") {
          const realData = JSON.parse(recvData.data);
          console.log("this", this);
          this.callBackMapping[socketType].call(this, realData);
        } /* else if (action === "fullScreen") {
        } else if (action === "themeChange") {
        } */
      }
    };
  }

  /**
   * 注册一个回调函数
   * @param {*} socketType 回调函数的唯一标识
   * @param {*} callBack 回调函数
   */
  registerCallBack(socketType, callBack) {
    this.callBackMapping[socketType] = callBack;
  }

  /**
   * 取消某一个回调函数
   * @param {*} socketType 回调函数的唯一标识
   */
  unRegisterCallBack(socketType) {
    this.callBackMapping[socketType] = null;
  }

  // 向服务端发送数据的方法
  send(data) {
    // 判断此时此刻有没有连接成功
    if (this.connected) {
      this.sendRetryCount = 0;
      this.ws.send(JSON.stringify(data));
    } else {
      this.sendRetryCount++;
      setTimeout(() => {
        this.send(data);
      }, this.sendRetryCount * 500);
    }
  }
}
