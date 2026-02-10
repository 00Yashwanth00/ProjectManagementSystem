package com.yashwanth.pms.comment.dto;

import com.yashwanth.pms.comment.domain.Comment;

import java.time.LocalDateTime;
import java.util.UUID;

public class CommentResponse {

    private UUID id;
    private String content;
    private UUID authorId;
    private LocalDateTime createdAt;

    public static CommentResponse from(Comment comment) {
        CommentResponse r = new CommentResponse();
        r.id = comment.getId();
        r.content = comment.getContent();
        r.authorId = comment.getAuthor().getId();
        r.createdAt = comment.getCreatedAt();
        return r;
    }

    public UUID getId() {
        return id;
    }

    public String getContent() {
        return content;
    }

    public UUID getAuthorId() {
        return authorId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
