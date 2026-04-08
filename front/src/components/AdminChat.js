import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useEffect, useState } from 'react';

export default function AdminChat() {
  const [messages, setMessages] = useState([]);
  let stompClient;

  useEffect(() => {
    const socket = new SockJS('http://localhost:8080/ws');
    stompClient = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log(str),
    });

    stompClient.onConnect = () => {
      console.log("Connected to WebSocket");

      // الاشتراك في القناة المشتركة
      stompClient.subscribe('/topic/messages', (msg) => {
        const chat = JSON.parse(msg.body);
        setMessages((prev) => [...prev, chat]);
      });
    };

    stompClient.activate();

    // جلب الرسائل السابقة عبر REST
    fetch('http://localhost:8080/api/chat/history')
      .then(res => res.json())
      .then(data => setMessages(data));

    return () => stompClient.deactivate();
  }, []);

  const sendMessage = (content) => {
    const message = { senderId: "admin", receiverId: "all", content };
    stompClient.publish({
      destination: '/app/chat.send',
      body: JSON.stringify(message),
    });
  };

  return (
    <div>
      <h2>Admin Chat</h2>
      <div style={{ maxHeight: "300px", overflowY: "auto" }}>
        {messages.map((m, i) => (
          <div key={i}><b>{m.senderId}:</b> {m.content}</div>
        ))}
      </div>
      <input type="text" placeholder="Type message" id="chatInput" />
      <button onClick={() => sendMessage(document.getElementById('chatInput').value)}>Send</button>
    </div>
  );
}
