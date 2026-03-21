package com.yashwanth.pms.notification.service;

import com.yashwanth.pms.notification.domain.Notification;
import com.yashwanth.pms.notification.domain.NotificationType;
import com.yashwanth.pms.notification.repository.NotificationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;


class NotificationServiceTest {

    private NotificationRepository repository;

    private NotificationServiceImpl service;

    @BeforeEach
    void setUp() {

        repository = Mockito.mock(NotificationRepository.class);

        service = new NotificationServiceImpl(repository);
    }

    @Test
    void shouldCreateNotification() {

        UUID userId = UUID.randomUUID();

        service.notifyUser(
                userId,
                NotificationType.TASK_ASSIGNED,
                "Task assigned"
        );

        verify(repository, times(1))
                .save(any(Notification.class));
    }

    @Test
    void shouldReturnUserNotifications() {

        UUID userId = UUID.randomUUID();

        Notification n = new Notification(
                userId,
                "msg",
                NotificationType.TASK_ASSIGNED
        );

        when(repository.findByUserId(userId))
                .thenReturn(List.of(n));

        List<Notification> list =
                service.getUserNotifications(userId);

        assertEquals(1, list.size());
    }

    @Test
    void shouldMarkNotificationRead() {

        UUID id = UUID.randomUUID();

        Notification n =
                new Notification(
                        UUID.randomUUID(),
                        "msg",
                        NotificationType.TASK_ASSIGNED
                );

        when(repository.findById(id))
                .thenReturn(Optional.of(n));

        service.markAsRead(id);

        verify(repository).save(n);

        assertTrue(n.isRead());
    }

}