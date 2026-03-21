package com.yashwanth.pms.notification.listener;

import com.yashwanth.pms.events.CommentAddedEvent;
import com.yashwanth.pms.events.IssueAssignedEvent;
import com.yashwanth.pms.events.TaskAssignedEvent;
import com.yashwanth.pms.notification.domain.NotificationType;
import com.yashwanth.pms.notification.service.NotificationService;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class NotificationListener {

    private final NotificationService notificationService;

    public NotificationListener(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @EventListener
    public void handleTaskAssigned(TaskAssignedEvent event) {

        String message = "You were assigned task: " + event.getTaskTitle();

        notificationService.notifyUser(event.getUserId(), NotificationType.TASK_ASSIGNED, message);

    }

    @EventListener
    public void handleIssueAssigned(IssueAssignedEvent event) {

        String message = "You were assigned issue: " + event.getIssueTitle();

        notificationService.notifyUser(event.getAssigneeId(), NotificationType.ISSUE_ASSIGNED, message);
    }

    @EventListener
    public void handleCommentAdded(CommentAddedEvent event) {

        for(UUID userId : event.getUserIds()) {
            notificationService.notifyUser(userId, NotificationType.COMMENT_ADDED, event.getMessage());
        }

    }
}
