package com.yashwanth.pms.comment.service;

import com.yashwanth.pms.comment.domain.Comment;
import com.yashwanth.pms.comment.dto.CommentRequest;
import com.yashwanth.pms.comment.repository.CommentRepository;
import com.yashwanth.pms.common.exception.AccessDeniedException;
import com.yashwanth.pms.common.exception.BusinessException;
import com.yashwanth.pms.common.exception.ResourceNotFoundException;
import com.yashwanth.pms.events.CommentAddedEvent;
import com.yashwanth.pms.issue.domain.Issue;
import com.yashwanth.pms.issue.service.IssueService;
import com.yashwanth.pms.project.domain.Project;
import com.yashwanth.pms.task.domain.Task;
import com.yashwanth.pms.task.service.TaskService;
import com.yashwanth.pms.user.domain.User;
import com.yashwanth.pms.user.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CommentServiceImpl implements CommentService {

    private static final Logger logger = LoggerFactory.getLogger(CommentServiceImpl.class);

    private final CommentRepository commentRepository;
    private final TaskService taskService;
    private final IssueService issueService;
    private final UserService userService;
    private final ApplicationEventPublisher publisher;

    public CommentServiceImpl(CommentRepository commentRepository,
                              TaskService taskService,
                              IssueService issueService,
                              UserService userService,
                              ApplicationEventPublisher publisher) {
        this.commentRepository = commentRepository;
        this.taskService = taskService;
        this.issueService = issueService;
        this.userService = userService;
        this.publisher = publisher;
    }

    // ============================================================
    // Task Comments
    // ============================================================

    @Override
    @Transactional
    public Comment addCommentToTask(UUID taskId, CommentRequest request, UUID authorId) {
        User author = userService.getById(authorId);
        Task task = taskService.getById(taskId);

        Project project = task.getProject();
        if (!project.isMember(author)) {
            throw new AccessDeniedException("You must be a project member to comment");
        }

        Comment parentComment = null;
        if (request.getParentCommentId() != null) {
            parentComment = getById(request.getParentCommentId());
            if (!parentComment.getTask().getId().equals(taskId)) {
                throw new BusinessException("Parent comment does not belong to this task");
            }
        }

        Comment comment = new Comment(request.getContent(), author, task, null, parentComment);
        Comment savedComment = commentRepository.save(comment);

        // ✅ Build list of users to notify (excluding the author)
        List<UUID> userIds = new ArrayList<>();

        if (task.getAssignee() != null && !task.getAssignee().getId().equals(authorId)) {
            userIds.add(task.getAssignee().getId());
        }

        if (task.getCreatedBy() != null && !task.getCreatedBy().getId().equals(authorId)) {
            userIds.add(task.getCreatedBy().getId());
        }

        if (project.getLeader() != null && !project.getLeader().getId().equals(authorId)) {
            userIds.add(project.getLeader().getId());
        }

        // ✅ Remove duplicates
        userIds = userIds.stream().distinct().collect(Collectors.toList());

        // ✅ Only publish if there are users to notify
        if (!userIds.isEmpty()) {
            CommentAddedEvent event = new CommentAddedEvent(
                    savedComment.getId(),
                    taskId,
                    null,
                    authorId,
                    author.getName(),
                    task.getTitle(),
                    "TASK",
                    userIds
            );
            publisher.publishEvent(event);
            logger.info("Comment notification sent to {} users for task: {}", userIds.size(), task.getTitle());
        } else {
            logger.debug("No users to notify for comment on task: {}", task.getTitle());
        }

        logger.info("Comment added to task {} by {}", task.getTitle(), author.getEmail());
        return savedComment;
    }

    @Override
    public List<Comment> getCommentsByTask(UUID taskId) {
        Task task = taskService.getById(taskId);
        return commentRepository.findTopLevelByTaskId(taskId);
    }

    // ============================================================
    // Issue Comments
    // ============================================================

    @Override
    @Transactional
    public Comment addCommentToIssue(UUID issueId, CommentRequest request, UUID authorId) {
        User author = userService.getById(authorId);
        Issue issue = issueService.getById(issueId);

        Project project = issue.getProject();
        if (!project.isMember(author)) {
            throw new AccessDeniedException("You must be a project member to comment");
        }

        Comment parentComment = null;
        if (request.getParentCommentId() != null) {
            parentComment = getById(request.getParentCommentId());
            if (!parentComment.getIssue().getId().equals(issueId)) {
                throw new BusinessException("Parent comment does not belong to this issue");
            }
        }

        Comment comment = new Comment(request.getContent(), author, null, issue, parentComment);
        Comment savedComment = commentRepository.save(comment);

        // ✅ Build list of users to notify (excluding the author)
        List<UUID> userIds = new ArrayList<>();

        if (issue.getAssignee() != null && !issue.getAssignee().getId().equals(authorId)) {
            userIds.add(issue.getAssignee().getId());
        }

        if (issue.getReporter() != null && !issue.getReporter().getId().equals(authorId)) {
            userIds.add(issue.getReporter().getId());
        }

        if (project.getLeader() != null && !project.getLeader().getId().equals(authorId)) {
            userIds.add(project.getLeader().getId());
        }

        // ✅ Remove duplicates
        userIds = userIds.stream().distinct().collect(Collectors.toList());

        // ✅ Only publish if there are users to notify
        if (!userIds.isEmpty()) {
            CommentAddedEvent event = new CommentAddedEvent(
                    savedComment.getId(),
                    null,
                    issueId,
                    authorId,
                    author.getName(),
                    issue.getTitle(),
                    "ISSUE",
                    userIds
            );
            publisher.publishEvent(event);
            logger.info("Comment notification sent to {} users for issue: {}", userIds.size(), issue.getTitle());
        } else {
            logger.debug("No users to notify for comment on issue: {}", issue.getTitle());
        }

        logger.info("Comment added to issue {} by {}", issue.getTitle(), author.getEmail());
        return savedComment;
    }


    @Override
    public List<Comment> getCommentsByIssue(UUID issueId) {
        Issue issue = issueService.getById(issueId);
        return commentRepository.findTopLevelByIssueId(issueId);
    }

    // ============================================================
    // Common Operations
    // ============================================================

    @Override
    @Transactional
    public Comment updateComment(UUID commentId, String newContent, UUID userId) {
        Comment comment = getById(commentId);
        User user = userService.getById(userId);

        if (!comment.canEdit(user)) {
            throw new AccessDeniedException("You don't have permission to edit this comment");
        }

        comment.updateContent(newContent);
        Comment updatedComment = commentRepository.save(comment);

        logger.info("Comment {} updated by {}", commentId, user.getEmail());
        return updatedComment;
    }

    @Override
    @Transactional
    public void deleteComment(UUID commentId, UUID userId) {
        Comment comment = getById(commentId);
        User user = userService.getById(userId);

        if (!comment.canDelete(user)) {
            throw new AccessDeniedException("You don't have permission to delete this comment");
        }

        commentRepository.delete(comment);
        logger.info("Comment {} deleted by {}", commentId, user.getEmail());
    }

    @Override
    public Comment getById(UUID commentId) {
        return commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));
    }

    @Override
    @Transactional
    public Comment replyToComment(UUID commentId, CommentRequest request, UUID authorId) {
        Comment parentComment = getById(commentId);

        if (parentComment.getTask() != null) {
            return addCommentToTask(parentComment.getTask().getId(), request, authorId);
        } else if (parentComment.getIssue() != null) {
            return addCommentToIssue(parentComment.getIssue().getId(), request, authorId);
        } else {
            throw new BusinessException("Parent comment has no associated task or issue");
        }
    }
}