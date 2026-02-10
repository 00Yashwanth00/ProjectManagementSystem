package com.yashwanth.pms.comment.controller;

import com.yashwanth.pms.comment.dto.AddCommentRequest;
import com.yashwanth.pms.comment.dto.CommentResponse;
import com.yashwanth.pms.comment.service.CommentService;
import com.yashwanth.pms.security.UserPrincipal;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @PostMapping("/tasks/{taskId}/comments")
    @ResponseStatus(HttpStatus.CREATED)
    public CommentResponse addCommentTask(@PathVariable UUID taskId, @Valid AddCommentRequest request, Authentication authentication) {

        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();

        return CommentResponse.from(
                commentService.addTaskComment(taskId, request.getContent(), principal.getId())
        );
     }

     @GetMapping("/tasks/{taskId}/comments")
     public List<CommentResponse> getTaskComments(@PathVariable UUID taskId) {

        return commentService.getCommentsForTask(taskId)
                .stream()
                .map(CommentResponse::from)
                .collect(Collectors.toList());
     }


     @PostMapping("/issues/{issueId}/comments")
     @ResponseStatus(HttpStatus.CREATED)
     public CommentResponse addCommentIssue(@PathVariable UUID issueId, @Valid AddCommentRequest request, Authentication authentication) {

         UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();

         return CommentResponse.from(
                 commentService.addIssueComment(issueId, request.getContent(), principal.getId())
         );
     }

     @GetMapping("issues/{issueId}/comments")
     public List<CommentResponse> getIssueComments(@PathVariable UUID issueId) {

         return commentService.getCommentsForIssue(issueId)
                 .stream()
                 .map(CommentResponse::from)
                 .collect(Collectors.toList());
     }


}
