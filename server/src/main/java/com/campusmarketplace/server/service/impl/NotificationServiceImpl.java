package com.campusmarketplace.server.service.impl;

import com.campusmarketplace.server.dto.response.NotificationResponse;
import com.campusmarketplace.server.entity.Notification;
import com.campusmarketplace.server.repository.NotificationRepository;
import com.campusmarketplace.server.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl
        implements NotificationService {

    private final NotificationRepository notificationRepository;

    // =====================================================
    // CREATE NOTIFICATION
    // =====================================================

    @Override
    public void createNotification(
            String recipientEmail,
            String type,
            String title,
            String message,
            String taskId
    ) {

        Notification notification = Notification.builder()
                .recipientEmail(recipientEmail)
                .type(type)
                .title(title)
                .message(message)
                .taskId(taskId)
                .read(false)
                .createdAt(LocalDateTime.now())
                .build();

        notificationRepository.save(notification);
    }

    // =====================================================
    // GET CURRENT USER NOTIFICATIONS
    // =====================================================

    @Override
    public List<NotificationResponse> getMyNotifications() {

        String currentUserEmail = getCurrentUserEmail();

        return notificationRepository
                .findByRecipientEmailOrderByCreatedAtDesc(
                        currentUserEmail
                )
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // =====================================================
    // GET UNREAD COUNT
    // =====================================================

    @Override
    public long getUnreadCount() {

        String currentUserEmail = getCurrentUserEmail();

        return notificationRepository
                .countByRecipientEmailAndReadFalse(
                        currentUserEmail
                );
    }

    // =====================================================
    // MARK ONE NOTIFICATION AS READ
    // =====================================================

    @Override
    public NotificationResponse markAsRead(
            String notificationId
    ) {

        String currentUserEmail = getCurrentUserEmail();

        Notification notification =
                notificationRepository
                        .findById(notificationId)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Notification not found"
                                )
                        );

        // Security check:
        // User should only modify their own notification
        if (!notification
                .getRecipientEmail()
                .equals(currentUserEmail)) {

            throw new RuntimeException(
                    "You are not allowed to access this notification"
            );
        }

        notification.setRead(true);

        Notification savedNotification =
                notificationRepository.save(notification);

        return toResponse(savedNotification);
    }

    // =====================================================
    // MARK ALL AS READ
    // =====================================================

    @Override
    public void markAllAsRead() {

        String currentUserEmail = getCurrentUserEmail();

        List<Notification> notifications =
                notificationRepository
                        .findByRecipientEmailAndReadFalseOrderByCreatedAtDesc(
                                currentUserEmail
                        );

        notifications.forEach(
                notification ->
                        notification.setRead(true)
        );

        notificationRepository.saveAll(notifications);
    }

    // =====================================================
    // GET LOGGED-IN USER EMAIL
    // =====================================================

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

    // =====================================================
    // ENTITY -> RESPONSE DTO
    // =====================================================

    private NotificationResponse toResponse(
            Notification notification
    ) {

        return NotificationResponse.builder()
                .id(notification.getId())
                .type(notification.getType())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .taskId(notification.getTaskId())
                .read(notification.isRead())
                .createdAt(notification.getCreatedAt())
                .build();
    }
}