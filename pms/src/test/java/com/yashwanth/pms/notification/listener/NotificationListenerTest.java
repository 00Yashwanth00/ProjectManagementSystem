package com.yashwanth.pms.notification.listener;

import com.yashwanth.pms.events.*;
import com.yashwanth.pms.notification.service.NotificationService;
import com.yashwanth.pms.task.domain.TaskStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

class NotificationListenerTest {

    private NotificationService notificationService;

    private NotificationListener listener;

    @BeforeEach
    void setUp() {

        notificationService = mock(NotificationService.class);

        listener =
                new NotificationListener(notificationService);
    }

    @Test
    void notifyOnTaskAssigned() {

        UUID userId = UUID.randomUUID();

        TaskAssignedEvent event =
                new TaskAssignedEvent(
                        UUID.randomUUID(),
                        userId,
                        "Task title"
                );

        listener.handleTaskAssigned(event);

        verify(notificationService)
                .notifyUser(
                        eq(userId),
                        any(),
                        any()
                );
    }


    @Test
    void notifyOnIssueAssigned() {

        UUID userId = UUID.randomUUID();

        IssueAssignedEvent event =
                new IssueAssignedEvent(
                        userId,
                        UUID.randomUUID(),
                        UUID.randomUUID(),
                        "Issue title"

                );

        listener.handleIssueAssigned(event);

        verify(notificationService)
                .notifyUser(
                        eq(userId),
                        any(),
                        any()
                );
    }

    @Test
    void notifyToAllUsersOnCommentAdded() {

        UUID user1 = UUID.randomUUID();
        UUID user2 = UUID.randomUUID();

        CommentAddedEvent event =
                new CommentAddedEvent(
                        List.of(user1, user2),
                        "New comment"
                );

        listener.handleCommentAdded(event);

        verify(notificationService, times(1))
                .notifyUser(eq(user1), any(), any());

        verify(notificationService, times(1))
                .notifyUser(eq(user2), any(), any());

        verify(notificationService, times(2))
                .notifyUser(any(), any(), any());
    }

    @Test
    void notifyToAllMembersOnNewMemberAdded() {

        UUID user1 = UUID.randomUUID();
        UUID user2 = UUID.randomUUID();

        ProjectMemberAddedEvent event = new ProjectMemberAddedEvent("Test Project", "test member", "user@test.com", List.of(user1, user2));

        listener.handleProjectMemberAdded(event);

        verify(notificationService, times(1))
                .notifyUser(eq(user1), any(), any());

        verify(notificationService, times(1))
                .notifyUser(eq(user2), any(), any());

        verify(notificationService, times(2))
                .notifyUser(any(), any(), any());
    }

    @Test
    void notifyOnTaskStatusChange() {

        UUID task = UUID.randomUUID();
        UUID user = UUID.randomUUID();

        TaskStatusChangedEvent event = new TaskStatusChangedEvent(task, user, TaskStatus.TODO, TaskStatus.IN_PROGRESS, "test user", "test task");

        listener.handleTaskStatusChanged(event);

        verify(notificationService, times(1))
                .notifyUser(eq(user), any(), any());
    }
}

