package com.example.ecom.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "chat_messages")
public class ChatMessage {

    @Id
    private String id;             // Unique message ID
    private String senderId;       // Sender user ID
    private String senderName;     // Sender username (optional)
    private String receiverId;     // Receiver user ID ("all" for broadcast)
    private String content;        // Message content (text or URL)
    private long timestamp;        // Epoch millis for sorting

    // ✅ Constructors
    public ChatMessage() {}

    public ChatMessage(String senderId, String senderName, String receiverId, String content, long timestamp) {
        this.senderId = senderId;
        this.senderName = senderName;
        this.receiverId = receiverId;
        this.content = content;
        this.timestamp = timestamp;
    }

    // ✅ Getters & Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getSenderId() { return senderId; }
    public void setSenderId(String senderId) { this.senderId = senderId; }

    public String getSenderName() { return senderName; }
    public void setSenderName(String senderName) { this.senderName = senderName; }

    public String getReceiverId() { return receiverId; }
    public void setReceiverId(String receiverId) { this.receiverId = receiverId; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public long getTimestamp() { return timestamp; }
    public void setTimestamp(long timestamp) { this.timestamp = timestamp; }

    @Override
    public String toString() {
        return "ChatMessage{" +
                "id='" + id + '\'' +
                ", senderId='" + senderId + '\'' +
                ", senderName='" + senderName + '\'' +
                ", receiverId='" + receiverId + '\'' +
                ", content='" + content + '\'' +
                ", timestamp=" + timestamp +
                '}';
    }
}