package com.yashwanth.pms.comment.service;

import com.yashwanth.pms.comment.domain.Comment;
import com.yashwanth.pms.comment.repository.CommentRepository;
import com.yashwanth.pms.issue.domain.Issue;
import com.yashwanth.pms.issue.service.IssueService;
import com.yashwanth.pms.task.domain.Task;
import com.yashwanth.pms.task.service.TaskService;
import com.yashwanth.pms.user.domain.User;
import com.yashwanth.pms.user.service.UserService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final TaskService taskService;
    private final UserService userService;
    private final IssueService issueService;

    public CommentServiceImpl(CommentRepository commentRepository, TaskService taskService, UserService userService, IssueService issueService) {
        this.commentRepository = commentRepository;
        this.taskService = taskService;
        this.userService = userService;
        this.issueService = issueService;
    }

    @Override
    public Comment addTaskComment(UUID taskId, String content, UUID authorId) {

        Task task = taskService.getById(taskId);
        User author = userService.getById(authorId);

        Comment comment = Comment.forTask(content, author, task);

        return commentRepository.save(comment);
    }

    @Override
    public Comment addIssueComment(UUID issueId, String content, UUID authorId) {
        Issue issue = issueService.getById(issueId);
        User author = userService.getById(authorId);

        Comment comment = Comment.forIssue(content, author, issue);

        return commentRepository.save(comment);
    }

    @Override
    public List<Comment> getCommentsForTask(UUID taskId) {

        Task task = taskService.getById(taskId);
        return commentRepository.findByTaskOrderByCreatedAtAsc(task);
    }

    @Override
    public List<Comment> getCommentsForIssue(UUID issueId) {

        Issue issue = issueService.getById(issueId);
        return commentRepository.findByIssueOrderByCreatedAtAsc(issue);
    }
}
