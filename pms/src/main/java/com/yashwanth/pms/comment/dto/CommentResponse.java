package com.yashwanth.pms.comment.dto;

import com.yashwanth.pms.comment.domain.Comment;
import com.yashwanth.pms.user.dto.UserResponse;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

public class CommentResponse {

    private UUID id;
    private String content;
    private UserResponse author;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean isEdited;
    private UUID taskId;
    private UUID issueId;
    private UUID parentCommentId;
    private List<CommentResponse> replies;
    private boolean canEdit;
    private boolean canDelete;

    public static CommentResponse from(Comment comment) {
        CommentResponse response = new CommentResponse();
        response.id = comment.getId();
        response.content = comment.getContent();
        response.author = UserResponse.from(comment.getAuthor());
        response.createdAt = comment.getCreatedAt();
        response.updatedAt = comment.getUpdatedAt();
        response.isEdited = comment.getUpdatedAt() != null &&
                comment.getUpdatedAt().isAfter(comment.getCreatedAt());
        response.taskId = comment.getTask() != null ? comment.getTask().getId() : null;
        response.issueId = comment.getIssue() != null ? comment.getIssue().getId() : null;
        response.parentCommentId = comment.getParentComment() != null ?
                comment.getParentComment().getId() : null;

        // ✅ Permission checks - default to false, will be set by service
        response.canEdit = false;
        response.canDelete = false;

        // ✅ Load replies if any
        if (comment.getReplies() != null && !comment.getReplies().isEmpty()) {
            response.replies = comment.getReplies().stream()
                    .map(CommentResponse::from)
                    .collect(Collectors.toList());
        }

        return response;
    }

    // ✅ New method with permission checks
    public static CommentResponse from(Comment comment, UUID currentUserId) {
        CommentResponse response = from(comment);

        // ✅ Check permissions
        if (comment.getAuthor() != null) {
            boolean isAuthor = comment.getAuthor().getId().equals(currentUserId);
            boolean isAdmin = false; // This should be checked properly

            // We'll set permissions in the service layer
            // This is just a placeholder
        }

        return response;
    }

    // Getters and setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public UserResponse getAuthor() { return author; }
    public void setAuthor(UserResponse author) { this.author = author; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    public boolean isEdited() { return isEdited; }
    public void setEdited(boolean edited) { isEdited = edited; }
    public UUID getTaskId() { return taskId; }
    public void setTaskId(UUID taskId) { this.taskId = taskId; }
    public UUID getIssueId() { return issueId; }
    public void setIssueId(UUID issueId) { this.issueId = issueId; }
    public UUID getParentCommentId() { return parentCommentId; }
    public void setParentCommentId(UUID parentCommentId) { this.parentCommentId = parentCommentId; }
    public List<CommentResponse> getReplies() { return replies; }
    public void setReplies(List<CommentResponse> replies) { this.replies = replies; }
    public boolean isCanEdit() { return canEdit; }
    public void setCanEdit(boolean canEdit) { this.canEdit = canEdit; }
    public boolean isCanDelete() { return canDelete; }
    public void setCanDelete(boolean canDelete) { this.canDelete = canDelete; }
}