package com.campusmarketplace.server.controller;

import com.campusmarketplace.server.dto.response.NotificationResponse;
import com.campusmarketplace.server.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    // =====================================================
    // GET MY NOTIFICATIONS
    // =====================================================

    @GetMapping
    public ResponseEntity<List<NotificationResponse>>
    getMyNotifications() {

        return ResponseEntity.ok(
                notificationService.getMyNotifications()
        );
    }

    // =====================================================
    // GET UNREAD COUNT
    // =====================================================

    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>>
    getUnreadCount() {

        long count =
                notificationService.getUnreadCount();

        return ResponseEntity.ok(
                Map.of("count", count)
        );
    }

    // =====================================================
    // MARK ONE NOTIFICATION AS READ
    // =====================================================

    @PutMapping("/{id}/read")
    public ResponseEntity<NotificationResponse>
    markAsRead(
            @PathVariable String id
    ) {

        return ResponseEntity.ok(
                notificationService.markAsRead(id)
        );
    }

    // =====================================================
    // MARK ALL NOTIFICATIONS AS READ
    // =====================================================

    @PutMapping("/read-all")
    public ResponseEntity<String>
    markAllAsRead() {

        notificationService.markAllAsRead();

        return ResponseEntity.ok(
                "All notifications marked as read"
        );
    }
}