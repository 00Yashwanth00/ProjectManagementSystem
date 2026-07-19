package com.yashwanth.pms.comment.service;

import com.yashwanth.pms.comment.domain.Comment;
import com.yashwanth.pms.comment.dto.CommentRequest;

import java.util.List;
import java.util.UUID;

public interface CommentService {

    // Task Comments
    Comment addCommentToTask(UUID taskId, CommentRequest request, UUID authorId);

    List<Comment> getCommentsByTask(UUID taskId);

    // Issue Comments
    Comment addCommentToIssue(UUID issueId, CommentRequest request, UUID authorId);

    List<Comment> getCommentsByIssue(UUID issueId);

    // Common
    Comment updateComment(UUID commentId, String newContent, UUID userId);

    void deleteComment(UUID commentId, UUID userId);

    Comment getById(UUID commentId);

    // Reply
    Comment replyToComment(UUID commentId, CommentRequest request, UUID authorId);
}