package com.yashwanth.pms.notification.service;

import com.yashwanth.pms.common.exception.AccessDeniedException;
import com.yashwanth.pms.common.exception.ResourceNotFoundException;
import com.yashwanth.pms.notification.domain.Notification;
import com.yashwanth.pms.notification.domain.NotificationType;
import com.yashwanth.pms.notification.repository.NotificationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class NotificationServiceTest {

    @Mock
    private NotificationRepository repository;

    private NotificationService service;

    @BeforeEach
    void setUp() {
        service = new NotificationServiceImpl(repository);
    }

    @Test
    void shouldCreateNotification() {
        // Given
        UUID userId = UUID.randomUUID();
        String message = "Task assigned";
        NotificationType type = NotificationType.TASK_ASSIGNED;

        // When
        service.notifyUser(userId, type, message);

        // Then
        verify(repository, times(1)).save(any(Notification.class));

        // ✅ Verify the notification was created with correct values
        ArgumentCaptor<Notification> captor = ArgumentCaptor.forClass(Notification.class);
        verify(repository).save(captor.capture());

        Notification savedNotification = captor.getValue();
        assertEquals(userId, savedNotification.getUserId());
        assertEquals(message, savedNotification.getMessage());
        assertEquals(type, savedNotification.getType());
        assertFalse(savedNotification.isRead());
        assertNotNull(savedNotification.getCreatedAt());
    }

    @Test
    void shouldReturnUserNotifications() {
        // Given
        UUID userId = UUID.randomUUID();

        Notification notification1 = new Notification(
                userId,
                "Message 1",
                NotificationType.TASK_ASSIGNED
        );

        Notification notification2 = new Notification(
                userId,
                "Message 2",
                NotificationType.COMMENT_ADDED
        );

        when(repository.findByUserIdOrderByCreatedAtDesc(userId))
                .thenReturn(List.of(notification1, notification2));

        // When
        List<Notification> notifications = service.getUserNotifications(userId);

        // Then
        assertNotNull(notifications);
        assertEquals(2, notifications.size());
        assertEquals("Message 1", notifications.get(0).getMessage());
        assertEquals(NotificationType.TASK_ASSIGNED, notifications.get(0).getType());

        verify(repository, times(1)).findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Test
    void shouldReturnUnreadCount() {
        // Given
        UUID userId = UUID.randomUUID();
        long expectedCount = 3;

        when(repository.countByUserIdAndReadFalse(userId))
                .thenReturn(expectedCount);

        // When
        long actualCount = service.getUnreadCount(userId);

        // Then
        assertEquals(expectedCount, actualCount);
        verify(repository, times(1)).countByUserIdAndReadFalse(userId);
    }

    @Test
    void shouldMarkNotificationRead() {
        // Given
        UUID notificationId = UUID.randomUUID();
        UUID userId = UUID.randomUUID();

        Notification notification = new Notification(
                userId,
                "Test message",
                NotificationType.TASK_ASSIGNED
        );

        when(repository.findById(notificationId))
                .thenReturn(Optional.of(notification));

        // When
        service.markAsRead(notificationId, userId);

        // Then
        verify(repository, times(1)).save(notification);
        assertTrue(notification.isRead());
    }

    @Test
    void shouldMarkAllNotificationsAsRead() {
        // Given
        UUID userId = UUID.randomUUID();

        Notification notification1 = new Notification(userId, "Message 1", NotificationType.TASK_ASSIGNED);
        Notification notification2 = new Notification(userId, "Message 2", NotificationType.COMMENT_ADDED);

        when(repository.findByUserIdAndReadFalse(userId))
                .thenReturn(List.of(notification1, notification2));

        // When
        service.markAllAsRead(userId);

        // Then
        verify(repository, times(1)).saveAll(any(List.class));
        assertTrue(notification1.isRead());
        assertTrue(notification2.isRead());
    }

    @Test
    void shouldThrowExceptionWhenMarkingReadWithWrongUser() {
        // Given
        UUID notificationId = UUID.randomUUID();
        UUID userId = UUID.randomUUID();
        UUID wrongUserId = UUID.randomUUID();

        Notification notification = new Notification(
                userId,
                "Test message",
                NotificationType.TASK_ASSIGNED
        );

        when(repository.findById(notificationId))
                .thenReturn(Optional.of(notification));

        // When & Then
        assertThrows(AccessDeniedException.class, () -> {
            service.markAsRead(notificationId, wrongUserId);
        });

        verify(repository, never()).save(any(Notification.class));
    }

    @Test
    void shouldThrowExceptionWhenNotificationNotFound() {
        // Given
        UUID notificationId = UUID.randomUUID();
        UUID userId = UUID.randomUUID();

        when(repository.findById(notificationId))
                .thenReturn(Optional.empty());

        // When & Then
        assertThrows(ResourceNotFoundException.class, () -> {
            service.markAsRead(notificationId, userId);
        });

        verify(repository, never()).save(any(Notification.class));
    }

    @Test
    void shouldGetNotificationById() {
        // Given
        UUID notificationId = UUID.randomUUID();
        UUID userId = UUID.randomUUID();

        Notification notification = new Notification(
                userId,
                "Test message",
                NotificationType.TASK_ASSIGNED
        );

        when(repository.findById(notificationId))
                .thenReturn(Optional.of(notification));

        // When
        Notification found = service.getNotification(notificationId);

        // Then
        assertNotNull(found);
        assertEquals(userId, found.getUserId());
        assertEquals("Test message", found.getMessage());
        assertEquals(NotificationType.TASK_ASSIGNED, found.getType());
    }

    @Test
    void shouldDeleteNotification() {
        // Given
        UUID notificationId = UUID.randomUUID();
        UUID userId = UUID.randomUUID();

        Notification notification = new Notification(
                userId,
                "Test message",
                NotificationType.TASK_ASSIGNED
        );

        when(repository.findById(notificationId))
                .thenReturn(Optional.of(notification));

        // When
        service.deleteNotification(notificationId, userId);

        // Then
        verify(repository, times(1)).delete(notification);
    }

    @Test
    void shouldThrowExceptionWhenDeletingWithWrongUser() {
        // Given
        UUID notificationId = UUID.randomUUID();
        UUID userId = UUID.randomUUID();
        UUID wrongUserId = UUID.randomUUID();

        Notification notification = new Notification(
                userId,
                "Test message",
                NotificationType.TASK_ASSIGNED
        );

        when(repository.findById(notificationId))
                .thenReturn(Optional.of(notification));

        // When & Then
        assertThrows(AccessDeniedException.class, () -> {
            service.deleteNotification(notificationId, wrongUserId);
        });

        verify(repository, never()).delete(any(Notification.class));
    }

    @Test
    void shouldDeleteAllNotifications() {
        // Given
        UUID userId = UUID.randomUUID();

        Notification notification1 = new Notification(userId, "Message 1", NotificationType.TASK_ASSIGNED);
        Notification notification2 = new Notification(userId, "Message 2", NotificationType.COMMENT_ADDED);

        when(repository.findByUserIdOrderByCreatedAtDesc(userId))
                .thenReturn(List.of(notification1, notification2));

        // When
        service.deleteAllNotifications(userId);

        // Then
        verify(repository, times(1)).deleteAll(List.of(notification1, notification2));
    }

    @Test
    void shouldHandleEmptyNotificationsList() {
        // Given
        UUID userId = UUID.randomUUID();

        when(repository.findByUserIdOrderByCreatedAtDesc(userId))
                .thenReturn(List.of());

        // When
        List<Notification> notifications = service.getUserNotifications(userId);

        // Then
        assertNotNull(notifications);
        assertTrue(notifications.isEmpty());
        verify(repository, times(1)).findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Test
    void shouldHandleZeroUnreadCount() {
        // Given
        UUID userId = UUID.randomUUID();

        when(repository.countByUserIdAndReadFalse(userId))
                .thenReturn(0L);

        // When
        long count = service.getUnreadCount(userId);

        // Then
        assertEquals(0L, count);
        verify(repository, times(1)).countByUserIdAndReadFalse(userId);
    }
}