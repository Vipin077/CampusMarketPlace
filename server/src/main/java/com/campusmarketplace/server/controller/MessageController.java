package com.campusmarketplace.server.controller;

import com.campusmarketplace.server.dto.request.SendMessageRequest;
import com.campusmarketplace.server.dto.response.MessageResponse;
import com.campusmarketplace.server.service.MessageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    // =========================================================
    // SEND MESSAGE
    // =========================================================

    @PostMapping
    public ResponseEntity<MessageResponse> sendMessage(
            @Valid @RequestBody SendMessageRequest request
    ) {

        return ResponseEntity.ok(
                messageService.sendMessage(request)
        );
    }

    // =========================================================
    // GET CONVERSATION WITH ANOTHER USER
    // =========================================================

    @GetMapping("/conversation")
    public ResponseEntity<List<MessageResponse>> getConversation(
            @RequestParam String email
    ) {

        return ResponseEntity.ok(
                messageService.getConversation(email)
        );
    }



@GetMapping("/conversations")
public ResponseEntity<List<String>> getConversations() {

    return ResponseEntity.ok(
            messageService.getConversations()
    );
}






    // =========================================================
    // MARK CONVERSATION AS READ
    // =========================================================

    @PutMapping("/read")
    public ResponseEntity<Void> markConversationAsRead(
            @RequestParam String senderEmail
    ) {

        messageService.markConversationAsRead(
                senderEmail
        );

        return ResponseEntity.noContent().build();
    }

    // =========================================================
    // GET UNREAD MESSAGE COUNT
    // =========================================================

    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount() {

        long count =
                messageService.getUnreadCount();

        return ResponseEntity.ok(
                Map.of("count", count)
        );
    }
}