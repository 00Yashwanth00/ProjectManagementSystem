package com.yashwanth.pms.notification.service;

import com.yashwanth.pms.notification.domain.Notification;
import com.yashwanth.pms.notification.domain.NotificationType;

import java.util.List;
import java.util.UUID;

public interface NotificationService {

    void notifyUser(UUID userId, NotificationType type, String message);

    List<Notification> getUserNotifications(UUID userId);

    void markAsRead(UUID notificationId, UUID userId);

    Notification getNotification(UUID notificationId);

}
