// src/services/ChatService.js
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

class ChatService {
  constructor() {
    this.client = null;
    this.callbacks = [];
  }

  connect(userId) {
    this.client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
      debug: (str) => console.log(str),
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("Connected to WebSocket");
        this.client.subscribe(`/user/${userId}/queue/messages`, (msg) => {
          const message = JSON.parse(msg.body);
          this.callbacks.forEach((cb) => cb(message));
        });
      },
    });

    this.client.activate();
  }

  sendMessage(senderId, receiverId, content) {
    if (!this.client || !this.client.connected) return;
    this.client.publish({
      destination: "/app/chat.send",
      body: JSON.stringify({ senderId, receiverId, content }),
    });
  }

  onMessage(callback) {
    this.callbacks.push(callback);
  }

  disconnect() {
    if (this.client) this.client.deactivate();
  }
}

export default new ChatService();
