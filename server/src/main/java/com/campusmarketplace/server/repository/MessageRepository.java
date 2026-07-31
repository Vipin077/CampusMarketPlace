package com.campusmarketplace.server.repository;

import com.campusmarketplace.server.entity.Message;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository
        extends MongoRepository<Message, String> {

    // Complete conversation between two users
    List<Message>
    findBySenderEmailAndReceiverEmailOrSenderEmailAndReceiverEmailOrderByCreatedAtAsc(
            String senderEmail1,
            String receiverEmail1,
            String senderEmail2,
            String receiverEmail2
    );

    // Messages received by a user
    List<Message> findByReceiverEmailOrderByCreatedAtDesc(
            String receiverEmail
    );

    // All messages sent by current user
    List<Message> findBySenderEmailOrderByCreatedAtDesc(
            String senderEmail
    );

    // Unread message count
    long countByReceiverEmailAndReadFalse(
            String receiverEmail
    );

    // Unread messages from particular user
    List<Message> findBySenderEmailAndReceiverEmailAndReadFalse(
            String senderEmail,
            String receiverEmail
    );
}