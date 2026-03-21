package com.yashwanth.pms.notification.service;

import com.yashwanth.pms.notification.domain.Notification;
import com.yashwanth.pms.notification.domain.NotificationType;
import com.yashwanth.pms.notification.repository.NotificationRepository;
import org.aspectj.weaver.ast.Not;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository repository;

    public NotificationServiceImpl(NotificationRepository repository) {
        this.repository = repository;
    }

    @Override
    public void notifyUser(UUID userId, NotificationType type, String message) {

        Notification notification = new Notification(userId, message, type);
        repository.save(notification);
    }

    @Override
    public List<Notification> getUserNotifications(UUID userId) {

        return repository.findByUserId(userId);

    }

    @Override
    public void markAsRead(UUID notificationId) {

        Notification n = repository.findById(notificationId)
                .orElseThrow();

        n.markAsRead();

        repository.save(n);

    }

    @Override
    public Notification getNotification(UUID notificationId) {

        return repository.findById(notificationId).orElseThrow();

    }
}
