package com.yashwanth.pms.notification.listener;

import com.yashwanth.pms.events.*;
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

    @EventListener
    public void handleProjectMemberAdded(ProjectMemberAddedEvent event) {

        String message = "New member is added to project %s: %s".formatted(event.getProjectName(), event.getMemberName());

        for(UUID userId : event.getMembers()) {
            notificationService.notifyUser(userId, NotificationType.PROJECT_MEMBER_ADDED, message);
        }

    }

    @EventListener
    public void handleTaskStatusChanged(TaskStatusChangedEvent event) {

        String message = "Task status change: \"%s\" by (%s)".formatted(event.getTitle(), event.getChangedBy());

        notificationService.notifyUser(event.getUserId(), NotificationType.TASK_STATUS_CHANGED, message);
    }

    @EventListener
    public void handleIssueStatusChanged(IssueStatusChangedEvent event) {

        String message = "Issue status change: \"%s\" by (%s)".formatted(event.getTitle(), event.getChangedBy());

        notificationService.notifyUser(event.getUserId(), NotificationType.ISSUE_STATUS_CHANGED, message);
    }
}
