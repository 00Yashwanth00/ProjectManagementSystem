package com.yashwanth.pms.comment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.UUID;

public class CommentRequest {

    @NotBlank(message = "Comment content cannot be empty")
    @Size(max = 1500, message = "Comment cannot exceed 1500 characters")
    private String content;

    private UUID parentCommentId;  // For replies (optional)

    public CommentRequest() {}

    public CommentRequest(String content) {
        this.content = content;
    }

    public CommentRequest(String content, UUID parentCommentId) {
        this.content = content;
        this.parentCommentId = parentCommentId;
    }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public UUID getParentCommentId() { return parentCommentId; }
    public void setParentCommentId(UUID parentCommentId) { this.parentCommentId = parentCommentId; }
}