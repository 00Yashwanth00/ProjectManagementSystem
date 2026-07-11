package com.yashwanth.pms.project.controller;

import com.yashwanth.pms.common.exception.AccessDeniedException;
import com.yashwanth.pms.project.domain.Project;
import com.yashwanth.pms.project.dto.*;
import com.yashwanth.pms.project.service.ProjectService;
import com.yashwanth.pms.security.UserPrincipal;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping()
    @PreAuthorize("hasRole('ADMIN')")
    public List<ProjectResponse> getAllProjects() {
        return projectService.getAllProjects().stream()
                .map(ProjectResponse::from)
                .toList();
    }

    @PostMapping(
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.CREATED)
    public ProjectResponse createProject(
            @Valid @RequestBody CreateProjectRequest request,
            Authentication authentication
    ) {
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        Project project = projectService.createProject(
                request.getName(),
                request.getLeaderId(),
                principal.getId()
        );
        return ProjectResponse.from(project);
    }

    @PostMapping("/{projectId}/members")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void addMembers(
            @PathVariable UUID projectId,
            @RequestBody List<UUID> userIds,
            Authentication authentication
    ) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        projectService.addMembers(projectId, userIds, userPrincipal.getId());
    }

    @DeleteMapping("/{projectId}/members/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeMember(
            @PathVariable UUID projectId,
            @PathVariable UUID userId,
            Authentication authentication
    ) {
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        projectService.removeMember(projectId, userId, principal.getId());
    }

    // ✅ UPDATED: Removed @PreAuthorize, using manual validation
    @GetMapping("/{projectId}")
    public ProjectResponse getProject(@PathVariable UUID projectId, Authentication authentication) {
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();

        // ✅ Validate access - checks if user is ADMIN, PROJECT_LEADER, or TEAM_MEMBER
        projectService.validateProjectAccess(projectId, principal.getId());

        Project project = projectService.getById(projectId);
        return ProjectResponse.from(project);
    }

    @GetMapping("/my")
    @PreAuthorize("isAuthenticated()")
    public List<ProjectResponse> getMyProjects(Authentication authentication) {
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        UUID userId = principal.getId();

        List<Project> projects = projectService.getProjectsByMemberId(userId);
        return projects.stream()
                .map(ProjectResponse::from)
                .collect(Collectors.toList());
    }

    @PatchMapping("/{projectId}/leader")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateLeader(
            @PathVariable UUID projectId,
            @RequestBody UpdateLeaderRequest request,
            Authentication authentication
    ) {
        if (request.getLeaderId() == null) {
            return ResponseEntity.badRequest().body(
                    Map.of("error", "leaderId is required")
            );
        }

        try {
            Project updatedProject = projectService.updateProjectLeader(projectId, request.getLeaderId());
            return ResponseEntity.ok(ProjectResponse.from(updatedProject));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    Map.of("error", e.getMessage())
            );
        }
    }

    @PatchMapping("/{projectId}/promote/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> promoteToLeader(
            @PathVariable UUID projectId,
            @PathVariable UUID userId,
            Authentication authentication
    ) {
        try {
            UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
            projectService.promoteToLeader(projectId, userId, principal.getId());
            return ResponseEntity.ok(Map.of("message", "User promoted to leader successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    Map.of("error", e.getMessage())
            );
        }
    }

    @PatchMapping("/{projectId}/demote/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> demoteFromLeader(
            @PathVariable UUID projectId,
            @PathVariable UUID userId,
            Authentication authentication
    ) {
        try {
            projectService.demoteFromLeader(projectId, userId, ((UserPrincipal) authentication.getPrincipal()).getId());
            return ResponseEntity.ok(Map.of("message", "Leader demoted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    Map.of("error", e.getMessage())
            );
        }
    }
}