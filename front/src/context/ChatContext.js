// src/context/ChatContext.js
import { createContext, useContext, useEffect, useState } from "react";
import ChatService from "../services/ChatService";

const ChatContext = createContext();

export const ChatProvider = ({ currentUserId, children }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    ChatService.connect(currentUserId);

    ChatService.onMessage((msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => ChatService.disconnect();
  }, [currentUserId]);

  const sendMessage = (receiverId, content) => {
    ChatService.sendMessage(currentUserId, receiverId, content);
  };

  return (
    <ChatContext.Provider value={{ messages, sendMessage }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
