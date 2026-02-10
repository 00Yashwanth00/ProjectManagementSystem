package com.yashwanth.pms.comment.service;

import com.yashwanth.pms.comment.domain.Comment;

import java.util.List;
import java.util.UUID;

public interface CommentService {

    Comment addTaskComment(UUID taskId, String content, UUID authorId);

    Comment addIssueComment(UUID issueId, String content, UUID authorId);

    List<Comment> getCommentsForTask(UUID taskId);

    List<Comment> getCommentsForIssue(UUID issueId);

}
