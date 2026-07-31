package com.campusmarketplace.server.repository;

import com.campusmarketplace.server.entity.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository
        extends MongoRepository<Notification, String> {

    // Get all notifications of a user, newest first
    List<Notification> findByRecipientEmailOrderByCreatedAtDesc(
            String recipientEmail
    );

    // Count unread notifications
    long countByRecipientEmailAndReadFalse(
            String recipientEmail
    );

    // Get unread notifications
    List<Notification> findByRecipientEmailAndReadFalseOrderByCreatedAtDesc(
            String recipientEmail
    );
}