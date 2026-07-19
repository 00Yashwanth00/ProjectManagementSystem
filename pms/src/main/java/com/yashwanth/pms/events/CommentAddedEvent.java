package com.yashwanth.pms.events;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

public class CommentAddedEvent {

    private final UUID commentId;
    private final UUID taskId;
    private final UUID issueId;
    private final UUID authorId;
    private final String authorName;
    private final String targetTitle;
    private final String targetType;
    private final List<UUID> userIds;

    public CommentAddedEvent(UUID commentId, UUID taskId, UUID issueId,
                             UUID authorId, String targetTitle, String targetType) {
        this(commentId, taskId, issueId, authorId, "A user", targetTitle, targetType, new ArrayList<>());
    }

    public CommentAddedEvent(UUID commentId, UUID taskId, UUID issueId,
                             UUID authorId, String targetTitle, String targetType,
                             List<UUID> userIds) {
        this(commentId, taskId, issueId, authorId, "A user", targetTitle, targetType, userIds);
    }

    public CommentAddedEvent(UUID commentId, UUID taskId, UUID issueId,
                             UUID authorId, String authorName, String targetTitle,
                             String targetType, List<UUID> userIds) {
        this.commentId = commentId;
        this.taskId = taskId;
        this.issueId = issueId;
        this.authorId = authorId;
        this.authorName = authorName != null ? authorName : "A user";
        this.targetTitle = targetTitle;
        this.targetType = targetType;

        // ✅ Remove duplicates and exclude the author
        if (userIds != null) {
            this.userIds = userIds.stream()
                    .filter(id -> id != null && !id.equals(authorId))
                    .distinct()
                    .collect(Collectors.toList());
        } else {
            this.userIds = new ArrayList<>();
        }
    }

    // Getters
    public UUID getCommentId() { return commentId; }
    public UUID getTaskId() { return taskId; }
    public UUID getIssueId() { return issueId; }
    public UUID getAuthorId() { return authorId; }
    public String getAuthorName() { return authorName; }
    public String getTargetTitle() { return targetTitle; }
    public String getTargetType() { return targetType; }
    public List<UUID> getUserIds() { return userIds; }

    public void addUserId(UUID userId) {
        if (userId != null && !userId.equals(authorId) && !this.userIds.contains(userId)) {
            this.userIds.add(userId);
        }
    }
}