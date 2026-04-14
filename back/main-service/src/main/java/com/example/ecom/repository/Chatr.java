package com.example.ecom.repository;

import com.example.ecom.model.ChatMessage;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface Chatr extends MongoRepository<ChatMessage, String> {

    // ✅ Find all messages sent or received by a specific user + broadcasts
    List<ChatMessage> findBySenderIdOrReceiverIdOrReceiverIdOrderByTimestampAsc(String senderId, String receiverId, String broadcast);

    // ✅ Optional: find messages sent to all (broadcast)
    List<ChatMessage> findByReceiverIdOrderByTimestampAsc(String receiverId);
}