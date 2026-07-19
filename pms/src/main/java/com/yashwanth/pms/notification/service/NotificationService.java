package com.yashwanth.pms.notification.service;

import com.yashwanth.pms.notification.domain.Notification;
import com.yashwanth.pms.notification.domain.NotificationType;

import java.util.List;
import java.util.UUID;

public interface NotificationService {

    // Create
    void notifyUser(UUID userId, NotificationType type, String message);

    // Read
    List<Notification> getUserNotifications(UUID userId);
    Notification getNotification(UUID notificationId);
    long getUnreadCount(UUID userId);

    // Update
    void markAsRead(UUID notificationId, UUID userId);
    void markAllAsRead(UUID userId);

    // Delete
    void deleteNotification(UUID notificationId, UUID userId);
    void deleteAllNotifications(UUID userId);
}