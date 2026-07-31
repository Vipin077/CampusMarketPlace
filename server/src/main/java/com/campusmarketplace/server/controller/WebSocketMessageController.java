package com.campusmarketplace.server.controller;

import com.campusmarketplace.server.dto.request.SendMessageRequest;
import com.campusmarketplace.server.dto.response.MessageResponse;
import com.campusmarketplace.server.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
@RequiredArgsConstructor
public class WebSocketMessageController {

    private final MessageService messageService;

    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat.send")
    public void sendMessage(
            SendMessageRequest request,
            Principal principal
    ) {

        if (principal == null) {
            throw new RuntimeException(
                    "WebSocket user is not authenticated"
            );
        }

        String senderEmail =
                principal.getName();

        // Save using WebSocket authenticated user
        MessageResponse savedMessage =
                messageService.sendMessage(
                        request,
                        senderEmail
                );

        // Receiver gets message
        messagingTemplate.convertAndSendToUser(
                request.getReceiverEmail(),
                "/queue/messages",
                savedMessage
        );

        // Sender also gets saved message
        messagingTemplate.convertAndSendToUser(
                senderEmail,
                "/queue/messages",
                savedMessage
        );
    }
}