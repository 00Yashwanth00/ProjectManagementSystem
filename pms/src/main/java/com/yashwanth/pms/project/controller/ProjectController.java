package com.yashwanth.pms.project.controller;

import com.yashwanth.pms.common.exception.AccessDeniedException;
import com.yashwanth.pms.project.domain.Project;
import com.yashwanth.pms.project.dto.CreateProjectRequest;
import com.yashwanth.pms.project.dto.ProjectMemberRequest;
import com.yashwanth.pms.project.dto.ProjectResponse;
import com.yashwanth.pms.project.service.ProjectService;
import com.yashwanth.pms.security.UserPrincipal;
import com.yashwanth.pms.user.domain.User;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

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
            @Valid @RequestBody CreateProjectRequest request, Authentication authentication
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
    @PreAuthorize("hasAnyRole('ADMIN', 'PROJECT_LEADER')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void addMember(@PathVariable UUID projectId, @Valid @RequestBody ProjectMemberRequest request, Authentication authentication) {

        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        projectService.addMember(projectId, request.getUserId(), userPrincipal.getId());
    }

    @DeleteMapping("/{projectId}/members/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PROJECT_LEADER')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeMember(
            @PathVariable UUID projectId,
            @PathVariable UUID userId,
            Authentication authentication
    ) {

        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        projectService.removeMember(projectId, userId, principal.getId());
    }

    @PostMapping("/{projectId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PROJECT_LEADER')")
    public ProjectResponse getProject(@PathVariable UUID projectId, Authentication authentication) {

        Project project = projectService.getById(projectId);

        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();

        if(principal.getRole().equals("PROJECT_LEADER") && !project.getLeader().getId().equals(principal.getId())) {
            throw new AccessDeniedException("You are not allowed to access this project");
        }

        return ProjectResponse.from(project);

    }
}
