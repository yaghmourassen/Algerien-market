import React, { useState, useEffect, useRef, useContext } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import "../styles/contact.css";
import { UserContext } from "../context/UserContext";

export default function Contact() {
  const { user } = useContext(UserContext);
  const currentUserId = user?.id?.toString();
  const senderName = user?.username || "Guest";
  const adminId = "admin";

  const [messages, setMessages] = useState([]);
  const [form, setForm] = useState({ message: "" });
  const [connected, setConnected] = useState(false);

  const clientRef = useRef(null);
  const chatContainerRef = useRef(null);

  const scrollToBottom = () => {
    const panel = chatContainerRef.current;
    if (panel) panel.scrollTop = panel.scrollHeight;
  };

  // WebSocket connection
  useEffect(() => {
    if (!currentUserId) return;

    const client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
      reconnectDelay: 5000,
      debug: () => {},
      onConnect: () => {
        setConnected(true);

        // Subscribe to user's private queue
        client.subscribe(`/user/queue/messages`, (msg) => {
          const message = JSON.parse(msg.body);

          // Only show messages relevant to this user
          if (
            message.senderId === adminId ||
            message.senderId === currentUserId ||
            message.receiverId === currentUserId
          ) {
            setMessages((prev) => [...prev, message]);
          }
        });
      },
      onDisconnect: () => setConnected(false),
      onStompError: (err) => console.error("STOMP Error:", err),
    });

    client.activate();
    clientRef.current = client;

    // Load chat history
    fetch(`http://localhost:8080/api/chat/history?userId=${currentUserId}`)
      .then((res) => res.json())
      .then((data) => setMessages(data || []))
      .catch((err) => console.error(err));

    return () => client.deactivate();
  }, [currentUserId]);

  useEffect(scrollToBottom, [messages]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.message.trim() || !connected) return;

    const newMessage = {
      senderId: currentUserId,
      senderName,
      receiverId: adminId, // always send to admin
      content: form.message,
      timestamp: Date.now(),
    };

    clientRef.current.publish({
      destination: "/app/chat.send",
      body: JSON.stringify(newMessage),
    });

    setForm({ message: "" });
    setMessages((prev) => [...prev, newMessage]); // show instantly
  };

  return (
    <>
      <Header />
      <div style={{ height: "100vh", display: "flex", flexDirection: "column", padding: "20px" }}>
        <h2>Contact Admin</h2>

        <div
          ref={chatContainerRef}
          style={{ flex: 1, overflowY: "auto", border: "1px solid #ccc", padding: "10px", marginBottom: "10px", backgroundColor: "#f9f9f9", display: "flex", flexDirection: "column" }}
        >
          {messages.length === 0 ? (
            <p style={{ textAlign: "center", marginTop: "50px" }}>No messages yet</p>
          ) : (
            messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  padding: "6px 10px",
                  marginBottom: "6px",
                  borderRadius: "5px",
                  maxWidth: "70%",
                  alignSelf: msg.senderId === currentUserId ? "flex-end" : "flex-start",
                  backgroundColor: msg.senderId === currentUserId ? "#4f93ff" : "#e0e0e0",
                  color: msg.senderId === currentUserId ? "#fff" : "#000",
                  wordBreak: "break-word",
                }}
              >
                <b>{msg.senderId === currentUserId ? "You" : "Admin"}:</b> {msg.content}
              </div>
            ))
          )}
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", gap: "10px" }}>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Type your message"
            style={{ flex: 1, padding: "8px" }}
          />
          <button type="submit" style={{ padding: "8px 18px" }}>Send</button>
        </form>
      </div>
      <Footer />
    </>
  );
}