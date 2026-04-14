package com.example.ecom.controler;

import com.example.ecom.model.ChatMessage;
import com.example.ecom.repository.Chatr;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
public class Chatc {

    private final SimpMessagingTemplate messagingTemplate;
    private final Chatr chatRepo;

    public Chatc(SimpMessagingTemplate messagingTemplate, Chatr chatRepo) {
        this.messagingTemplate = messagingTemplate;
        this.chatRepo = chatRepo;
    }

    // ---------------- WebSocket: send message ----------------
    @MessageMapping("/chat.send")
    public void sendMessage(ChatMessage message) {
        message.setTimestamp(System.currentTimeMillis());
        chatRepo.save(message);

        if ("all".equals(message.getReceiverId())) {
            // Broadcast
            messagingTemplate.convertAndSend("/topic/messages", message);
        } else {
            // Private message: send to receiver
            messagingTemplate.convertAndSendToUser(
                    message.getReceiverId(),
                    "/queue/messages",
                    message
            );
            // Also send a copy to sender
            messagingTemplate.convertAndSendToUser(
                    message.getSenderId(),
                    "/queue/messages",
                    message
            );
        }
    }

    // ---------------- REST: fetch chat history ----------------
    @GetMapping("/api/chat/history")
    @ResponseBody
    public List<ChatMessage> getChatHistory(@RequestParam(value = "userId", required = false) String userId) {
        if (userId == null || userId.isEmpty()) {
            return chatRepo.findAll();
        }
        return chatRepo.findBySenderIdOrReceiverIdOrReceiverIdOrderByTimestampAsc(userId, userId, "all");
    }
}