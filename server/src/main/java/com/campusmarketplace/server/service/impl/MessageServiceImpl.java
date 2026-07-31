package com.campusmarketplace.server.service.impl;

import com.campusmarketplace.server.dto.request.SendMessageRequest;
import com.campusmarketplace.server.dto.response.MessageResponse;
import com.campusmarketplace.server.entity.Message;
import com.campusmarketplace.server.repository.MessageRepository;
import com.campusmarketplace.server.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MessageServiceImpl implements MessageService {

    private final MessageRepository messageRepository;

    // =========================================================
    // SEND MESSAGE - REST
    // =========================================================

    @Override
    public MessageResponse sendMessage(
            SendMessageRequest request
    ) {

        String currentUser = getCurrentUserEmail();

        return sendMessage(
                request,
                currentUser
        );
    }

    // =========================================================
    // SEND MESSAGE - WEBSOCKET
    // =========================================================

    @Override
    public MessageResponse sendMessage(
            SendMessageRequest request,
            String senderEmail
    ) {

        // Validate sender
        if (senderEmail == null ||
                senderEmail.isBlank()) {

            throw new RuntimeException(
                    "Sender email is required"
            );
        }

        // Validate receiver
        if (request.getReceiverEmail() == null ||
                request.getReceiverEmail().isBlank()) {

            throw new RuntimeException(
                    "Receiver email is required"
            );
        }

        // Validate message content
        if (request.getContent() == null ||
                request.getContent().isBlank()) {

            throw new RuntimeException(
                    "Message cannot be empty"
            );
        }

        // Prevent sending message to yourself
        if (senderEmail.equalsIgnoreCase(
                request.getReceiverEmail()
        )) {

            throw new RuntimeException(
                    "You cannot send a message to yourself"
            );
        }

        // Create message
        Message message = Message.builder()
                .senderEmail(senderEmail)
                .receiverEmail(
                        request.getReceiverEmail()
                )
                .content(
                        request.getContent().trim()
                )
                .taskId(
                        request.getTaskId()
                )
                .read(false)
                .createdAt(
                        LocalDateTime.now()
                )
                .build();

        // Save in MongoDB
        Message savedMessage =
                messageRepository.save(message);

        return mapToResponse(savedMessage);
    }

    // =========================================================
    // GET CONVERSATION
    // =========================================================

    @Override
    public List<MessageResponse> getConversation(
            String otherUserEmail
    ) {

        String currentUser =
                getCurrentUserEmail();

        List<Message> messages =
                messageRepository
                        .findBySenderEmailAndReceiverEmailOrSenderEmailAndReceiverEmailOrderByCreatedAtAsc(
                                currentUser,
                                otherUserEmail,
                                otherUserEmail,
                                currentUser
                        );

        return messages
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // =========================================================
    // GET CONVERSATIONS
    // =========================================================

    @Override
    public List<String> getConversations() {

        String currentUser =
                getCurrentUserEmail();

        List<Message> sentMessages =
                messageRepository
                        .findBySenderEmailOrderByCreatedAtDesc(
                                currentUser
                        );

        List<Message> receivedMessages =
                messageRepository
                        .findByReceiverEmailOrderByCreatedAtDesc(
                                currentUser
                        );

        return java.util.stream.Stream
                .concat(
                        sentMessages
                                .stream()
                                .map(
                                        Message::getReceiverEmail
                                ),

                        receivedMessages
                                .stream()
                                .map(
                                        Message::getSenderEmail
                                )
                )
                .distinct()
                .collect(Collectors.toList());
    }

    // =========================================================
    // MARK CONVERSATION AS READ
    // =========================================================

    @Override
    public void markConversationAsRead(
            String senderEmail
    ) {

        String currentUser =
                getCurrentUserEmail();

        List<Message> unreadMessages =
                messageRepository
                        .findBySenderEmailAndReceiverEmailAndReadFalse(
                                senderEmail,
                                currentUser
                        );

        if (unreadMessages.isEmpty()) {
            return;
        }

        unreadMessages.forEach(
                message ->
                        message.setRead(true)
        );

        messageRepository.saveAll(
                unreadMessages
        );
    }

    // =========================================================
    // GET UNREAD COUNT
    // =========================================================

    @Override
    public long getUnreadCount() {

        String currentUser =
                getCurrentUserEmail();

        return messageRepository
                .countByReceiverEmailAndReadFalse(
                        currentUser
                );
    }

    // =========================================================
    // CURRENT LOGGED-IN USER
    // Used by normal HTTP / REST requests
    // =========================================================

    private String getCurrentUserEmail() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            throw new RuntimeException(
                    "User is not authenticated"
            );
        }

        return authentication.getName();
    }

    // =========================================================
    // ENTITY -> RESPONSE DTO
    // =========================================================

    private MessageResponse mapToResponse(
            Message message
    ) {

        return MessageResponse.builder()
                .id(
                        message.getId()
                )
                .senderEmail(
                        message.getSenderEmail()
                )
                .receiverEmail(
                        message.getReceiverEmail()
                )
                .content(
                        message.getContent()
                )
                .taskId(
                        message.getTaskId()
                )
                .read(
                        message.isRead()
                )
                .createdAt(
                        message.getCreatedAt()
                )
                .build();
    }
}