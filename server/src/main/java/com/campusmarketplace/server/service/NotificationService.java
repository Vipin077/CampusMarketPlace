package com.campusmarketplace.server.service;

import com.campusmarketplace.server.dto.response.NotificationResponse;

import java.util.List;

public interface NotificationService {

    // Create a new notification
    void createNotification(
            String recipientEmail,
            String type,
            String title,
            String message,
            String taskId
    );

    // Get notifications of currently logged-in user
    List<NotificationResponse> getMyNotifications();

    // Get unread notification count
    long getUnreadCount();

    // Mark a single notification as read
    NotificationResponse markAsRead(String notificationId);

    // Mark all notifications as read
    void markAllAsRead();
}