package com.yashwanth.pms.notification.listener;

import com.yashwanth.pms.events.*;
import com.yashwanth.pms.notification.domain.NotificationType;
import com.yashwanth.pms.notification.service.NotificationService;
import com.yashwanth.pms.user.domain.User;
import com.yashwanth.pms.user.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Component
public class NotificationListener {

    private static final Logger logger = LoggerFactory.getLogger(NotificationListener.class);

    private final NotificationService notificationService;
    private final UserService userService;

    public NotificationListener(NotificationService notificationService, UserService userService) {
        this.notificationService = notificationService;
        this.userService = userService;
    }

    @EventListener
    public void handleTaskAssigned(TaskAssignedEvent event) {
        if (event.getAssigneeId() == null) {
            logger.warn("Task assigned event with null assignee ID");
            return;
        }

        String message = String.format("You were assigned task: %s", event.getTaskTitle());
        notificationService.notifyUser(event.getAssigneeId(), NotificationType.TASK_ASSIGNED, message);
        logger.debug("Notification sent for task assignment: {}", event.getTaskTitle());
    }

    @EventListener
    public void handleIssueAssigned(IssueAssignedEvent event) {
        if (event.getAssigneeId() == null) {
            logger.warn("Issue assigned event with null assignee ID");
            return;
        }

        String message = String.format("You were assigned issue: %s", event.getIssueTitle());
        notificationService.notifyUser(event.getAssigneeId(), NotificationType.ISSUE_ASSIGNED, message);
        logger.debug("Notification sent for issue assignment: {}", event.getIssueTitle());
    }

    @EventListener
    public void handleCommentAdded(CommentAddedEvent event) {
        // ✅ Check if there are users to notify
        if (event.getUserIds() == null || event.getUserIds().isEmpty()) {
            logger.debug("No users to notify for comment: {}", event.getCommentId());
            return;
        }

        // ✅ Get author name
        String authorName = event.getAuthorName();
        if ("A user".equals(authorName) && event.getAuthorId() != null) {
            try {
                User author = userService.getById(event.getAuthorId());
                authorName = author.getName();
            } catch (Exception e) {
                authorName = "A user";
            }
        }

        String message = String.format("%s commented on %s: %s",
                authorName,
                event.getTargetType().toLowerCase(),
                event.getTargetTitle()
        );

        // ✅ Use Set to ensure each user gets only one notification
        Set<UUID> uniqueUsers = new HashSet<>(event.getUserIds());
        uniqueUsers.remove(event.getAuthorId()); // Remove the comment author

        logger.debug("Sending {} comment notifications for comment: {}", uniqueUsers.size(), event.getCommentId());

        for (UUID userId : uniqueUsers) {
            notificationService.notifyUser(userId, NotificationType.COMMENT_ADDED, message);
        }
    }

    @EventListener
    public void handleProjectMemberAdded(ProjectMemberAddedEvent event) {
        String message = String.format("New member added to project %s: %s",
                event.getProjectName(),
                event.getMemberName()
        );

        for (UUID userId : event.getMembers()) {
            notificationService.notifyUser(userId, NotificationType.PROJECT_MEMBER_ADDED, message);
        }
    }

    @EventListener
    public void handleTaskStatusChanged(TaskStatusChangedEvent event) {
        String message = String.format("Task \"%s\" status changed from %s to %s by %s",
                event.getTaskTitle(),
                event.getOldStatus(),
                event.getNewStatus(),
                event.getChangedBy()
        );

        // ✅ Use Set to avoid duplicate notifications
        Set<UUID> uniqueUsers = new HashSet<>();

        if (event.getAssigneeId() != null) {
            uniqueUsers.add(event.getAssigneeId());
        }
        if (event.getCreatorId() != null && !event.getCreatorId().equals(event.getAssigneeId())) {
            uniqueUsers.add(event.getCreatorId());
        }

        for (UUID userId : uniqueUsers) {
            notificationService.notifyUser(userId, NotificationType.TASK_STATUS_CHANGED, message);
        }
    }

    @EventListener
    public void handleIssueStatusChanged(IssueStatusChangedEvent event) {
        String message = String.format("Issue \"%s\" status changed from %s to %s by %s",
                event.getIssueTitle(),
                event.getOldStatus(),
                event.getNewStatus(),
                event.getChangedBy()
        );

        // ✅ Use Set to avoid duplicate notifications
        Set<UUID> uniqueUsers = new HashSet<>();

        if (event.getAssigneeId() != null) {
            uniqueUsers.add(event.getAssigneeId());
        }
        if (event.getReporterId() != null && !event.getReporterId().equals(event.getAssigneeId())) {
            uniqueUsers.add(event.getReporterId());
        }

        for (UUID userId : uniqueUsers) {
            notificationService.notifyUser(userId, NotificationType.ISSUE_STATUS_CHANGED, message);
        }
    }
}