package com.yashwanth.pms.comment.controller;

import com.yashwanth.pms.comment.domain.Comment;
import com.yashwanth.pms.comment.dto.CommentRequest;
import com.yashwanth.pms.comment.dto.CommentResponse;
import com.yashwanth.pms.comment.service.CommentService;
import com.yashwanth.pms.security.UserPrincipal;
import com.yashwanth.pms.user.domain.Role;
import com.yashwanth.pms.user.domain.User;
import com.yashwanth.pms.user.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class CommentController {

    private final CommentService commentService;
    private final UserService userService;

    public CommentController(CommentService commentService, UserService userService) {
        this.commentService = commentService;
        this.userService = userService;
    }

    // ============================================================
    // Task Comment Endpoints
    // ============================================================

    @GetMapping("/tasks/{taskId}/comments")
    @PreAuthorize("isAuthenticated()")
    public List<CommentResponse> getTaskComments(
            @PathVariable UUID taskId,
            Authentication authentication
    ) {
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        User currentUser = userService.getById(principal.getId());

        return commentService.getCommentsByTask(taskId).stream()
                .map(comment -> {
                    CommentResponse response = CommentResponse.from(comment);
                    // ✅ Set permissions based on current user
                    response.setCanEdit(canEditComment(comment, currentUser));
                    response.setCanDelete(canDeleteComment(comment, currentUser));
                    return response;
                })
                .collect(Collectors.toList());
    }

    @PostMapping("/tasks/{taskId}/comments")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("isAuthenticated()")
    public CommentResponse addCommentToTask(
            @PathVariable UUID taskId,
            @Valid @RequestBody CommentRequest request,
            Authentication authentication
    ) {
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        User currentUser = userService.getById(principal.getId());

        Comment comment = commentService.addCommentToTask(taskId, request, principal.getId());
        CommentResponse response = CommentResponse.from(comment);
        response.setCanEdit(canEditComment(comment, currentUser));
        response.setCanDelete(canDeleteComment(comment, currentUser));
        return response;
    }

    // ============================================================
    // Issue Comment Endpoints
    // ============================================================

    @GetMapping("/issues/{issueId}/comments")
    @PreAuthorize("isAuthenticated()")
    public List<CommentResponse> getIssueComments(
            @PathVariable UUID issueId,
            Authentication authentication
    ) {
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        User currentUser = userService.getById(principal.getId());

        return commentService.getCommentsByIssue(issueId).stream()
                .map(comment -> {
                    CommentResponse response = CommentResponse.from(comment);
                    response.setCanEdit(canEditComment(comment, currentUser));
                    response.setCanDelete(canDeleteComment(comment, currentUser));
                    return response;
                })
                .collect(Collectors.toList());
    }

    @PostMapping("/issues/{issueId}/comments")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("isAuthenticated()")
    public CommentResponse addCommentToIssue(
            @PathVariable UUID issueId,
            @Valid @RequestBody CommentRequest request,
            Authentication authentication
    ) {
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        User currentUser = userService.getById(principal.getId());

        Comment comment = commentService.addCommentToIssue(issueId, request, principal.getId());
        CommentResponse response = CommentResponse.from(comment);
        response.setCanEdit(canEditComment(comment, currentUser));
        response.setCanDelete(canDeleteComment(comment, currentUser));
        return response;
    }

    // ============================================================
    // Common Comment Endpoints
    // ============================================================

    @PutMapping("/comments/{commentId}")
    @PreAuthorize("isAuthenticated()")
    public CommentResponse updateComment(
            @PathVariable UUID commentId,
            @Valid @RequestBody CommentRequest request,
            Authentication authentication
    ) {
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        User currentUser = userService.getById(principal.getId());

        Comment comment = commentService.updateComment(commentId, request.getContent(), principal.getId());
        CommentResponse response = CommentResponse.from(comment);
        response.setCanEdit(canEditComment(comment, currentUser));
        response.setCanDelete(canDeleteComment(comment, currentUser));
        return response;
    }

    @DeleteMapping("/comments/{commentId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("isAuthenticated()")
    public void deleteComment(
            @PathVariable UUID commentId,
            Authentication authentication
    ) {
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        commentService.deleteComment(commentId, principal.getId());
    }

    @PostMapping("/comments/{commentId}/replies")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("isAuthenticated()")
    public CommentResponse replyToComment(
            @PathVariable UUID commentId,
            @Valid @RequestBody CommentRequest request,
            Authentication authentication
    ) {
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        User currentUser = userService.getById(principal.getId());

        Comment comment = commentService.replyToComment(commentId, request, principal.getId());
        CommentResponse response = CommentResponse.from(comment);
        response.setCanEdit(canEditComment(comment, currentUser));
        response.setCanDelete(canDeleteComment(comment, currentUser));
        return response;
    }

    // ============================================================
    // Helper Methods for Permission Checks
    // ============================================================

    private boolean canEditComment(Comment comment, User currentUser) {
        if (currentUser.getRole() == Role.ADMIN) return true;
        return comment.getAuthor() != null &&
                comment.getAuthor().getId().equals(currentUser.getId());
    }

    private boolean canDeleteComment(Comment comment, User currentUser) {
        if (currentUser.getRole() == Role.ADMIN) return true;
        return comment.getAuthor() != null &&
                comment.getAuthor().getId().equals(currentUser.getId());
    }
}