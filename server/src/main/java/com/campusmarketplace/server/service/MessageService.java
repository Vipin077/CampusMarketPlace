package com.campusmarketplace.server.service;

import com.campusmarketplace.server.dto.request.SendMessageRequest;
import com.campusmarketplace.server.dto.response.MessageResponse;

import java.util.List;

public interface MessageService {

    // REST message sending
    MessageResponse sendMessage(
            SendMessageRequest request
    );

    // WebSocket message sending
    MessageResponse sendMessage(
            SendMessageRequest request,
            String senderEmail
    );

    List<MessageResponse> getConversation(
            String otherUserEmail
    );

    List<String> getConversations();

    void markConversationAsRead(
            String senderEmail
    );

    long getUnreadCount();
}