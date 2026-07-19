package com.yashwanth.pms.issue.controller;

import com.yashwanth.pms.common.exception.AccessDeniedException;
import com.yashwanth.pms.issue.dto.CreateIssueRequest;
import com.yashwanth.pms.issue.dto.IssueResponse;
import com.yashwanth.pms.issue.service.IssueService;
import com.yashwanth.pms.project.domain.Project;
import com.yashwanth.pms.project.service.ProjectService;
import com.yashwanth.pms.security.UserPrincipal;
import com.yashwanth.pms.user.domain.Role;
import com.yashwanth.pms.user.domain.User;
import com.yashwanth.pms.user.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/projects/{projectId}/issues")
public class IssueController {

    private final IssueService issueService;
    private final ProjectService projectService;
    private final UserService userService;

    public IssueController(IssueService issueService, ProjectService projectService, UserService userService) {
        this.issueService = issueService;
        this.projectService = projectService;
        this.userService = userService;
    }

    // ✅ CREATE ISSUE: Only PROJECT_LEADER and TEAM_MEMBER can create
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public IssueResponse createIssue(
            @PathVariable UUID projectId,
            @Valid @RequestBody CreateIssueRequest request,
            Authentication authentication
    ) {
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        User user = userService.getById(principal.getId());

        // ✅ ADMIN cannot create issues
        if (user.getRole() == Role.ADMIN) {
            throw new AccessDeniedException("Admin users cannot create issues");
        }

        // ✅ User must be a member of the project
        Project project = projectService.getById(projectId);
        if (!project.isMember(user)) {
            throw new AccessDeniedException("You must be a project member to create an issue");
        }

        return IssueResponse.from(
                issueService.createIssue(
                        projectId,
                        request.getTaskId(),
                        request.getTitle(),
                        request.getDescription(),
                        request.getType(),
                        request.getPriority(),
                        principal.getId(),
                        request.getAssigneeId()
                )
        );
    }

    // ✅ ASSIGN ISSUE: Only PROJECT_LEADER can assign
    @PostMapping("/{issueId}/assign/{userId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void assignIssue(
            @PathVariable UUID projectId,
            @PathVariable UUID issueId,
            @PathVariable UUID userId,
            Authentication authentication
    ) {
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        User user = userService.getById(principal.getId());

        // ✅ Only PROJECT_LEADER can assign issues
        Project project = projectService.getById(projectId);
        if (!project.isLeader(user)) {
            throw new AccessDeniedException("Only Project Leader can assign issues");
        }

        issueService.assignIssue(issueId, userId, principal.getId());
    }

    // ✅ CHANGE STATUS: PROJECT_LEADER, ASSIGNEE, or ADMIN can change
    @PatchMapping("/{issueId}/status")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void changeIssueStatus(
            @PathVariable UUID projectId,
            @PathVariable UUID issueId,
            @RequestBody Map<String, String> body,
            Authentication authentication
    ) {
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();

        // ✅ Validation handled in service layer
        issueService.changeIssueStatus(issueId, body.get("status"), principal.getId());
    }

    // ✅ GET ALL ISSUES: Any project member can view
    @GetMapping
    public List<IssueResponse> getIssues(
            @PathVariable UUID projectId,
            Authentication authentication
    ) {
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();

        // ✅ Validate user is a project member
        Project project = projectService.getById(projectId);
        User user = userService.getById(principal.getId());
        if (!project.isMember(user)) {
            throw new AccessDeniedException("You must be a project member to view issues");
        }

        return issueService.getIssuesByProject(projectId)
                .stream()
                .map(IssueResponse::from)
                .toList();
    }

    // ✅ GET SINGLE ISSUE: Any project member can view
    @GetMapping("/{issueId}")
    public IssueResponse getIssue(
            @PathVariable UUID projectId,
            @PathVariable UUID issueId,
            Authentication authentication
    ) {
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();

        // Validate user is a project member
        Project project = projectService.getById(projectId);
        User user = userService.getById(principal.getId());
        if (!project.isMember(user)) {
            throw new AccessDeniedException("You must be a project member to view issues");
        }

        return IssueResponse.from(issueService.getById(issueId));
    }
}