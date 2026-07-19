package com.yashwanth.pms.notification.service;

import com.yashwanth.pms.common.exception.AccessDeniedException;
import com.yashwanth.pms.common.exception.ResourceNotFoundException;
import com.yashwanth.pms.notification.domain.Notification;
import com.yashwanth.pms.notification.domain.NotificationType;
import com.yashwanth.pms.notification.repository.NotificationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository repository;

    public NotificationServiceImpl(NotificationRepository repository) {
        this.repository = repository;
    }

    @Override
    @Transactional
    public void notifyUser(UUID userId, NotificationType type, String message) {
        Notification notification = new Notification(userId, message, type);
        repository.save(notification);
    }

    @Override
    public List<Notification> getUserNotifications(UUID userId) {
        return repository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Override
    @Transactional
    public void markAsRead(UUID notificationId, UUID userId) {
        Notification notification = repository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));

        if (!notification.getUserId().equals(userId)) {
            throw new AccessDeniedException("You are not allowed to mark this notification as read");
        }

        notification.markAsRead();
        repository.save(notification);
    }

    @Override
    @Transactional
    public void markAllAsRead(UUID userId) {
        List<Notification> unreadNotifications = repository.findByUserIdAndReadFalse(userId);
        for (Notification notification : unreadNotifications) {
            notification.markAsRead();
        }
        repository.saveAll(unreadNotifications);
    }

    @Override
    public Notification getNotification(UUID notificationId) {
        return repository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));
    }

    @Override
    public long getUnreadCount(UUID userId) {
        return repository.countByUserIdAndReadFalse(userId);
    }

    @Override
    @Transactional
    public void deleteNotification(UUID notificationId, UUID userId) {
        Notification notification = repository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));

        if (!notification.getUserId().equals(userId)) {
            throw new AccessDeniedException("You are not allowed to delete this notification");
        }

        repository.delete(notification);
    }

    @Override
    @Transactional
    public void deleteAllNotifications(UUID userId) {
        List<Notification> notifications = repository.findByUserIdOrderByCreatedAtDesc(userId);
        repository.deleteAll(notifications);
    }
}