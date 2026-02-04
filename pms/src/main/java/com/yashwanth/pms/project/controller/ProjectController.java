package com.yashwanth.pms.project.controller;

import com.yashwanth.pms.project.domain.Project;
import com.yashwanth.pms.project.dto.CreateProjectRequest;
import com.yashwanth.pms.project.dto.ProjectMemberRequest;
import com.yashwanth.pms.project.dto.ProjectResponse;
import com.yashwanth.pms.project.service.ProjectService;
import com.yashwanth.pms.user.domain.User;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @PostMapping(
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    @ResponseStatus(HttpStatus.CREATED)
    public ProjectResponse createProject(
            @Valid @RequestBody CreateProjectRequest request,
            @RequestAttribute("currentUser") User currentUser
    ) {
        Project project = projectService.createProject(
                request.getName(),
                request.getLeaderId(),
                currentUser
        );
        return ProjectResponse.from(project);
    }

    @PostMapping("/{projectId}/members")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void addMember(@PathVariable UUID projectId, @Valid @RequestBody ProjectMemberRequest request, @RequestAttribute("currentUser") User currrentUser) {
        projectService.addMember(projectId, request.getUserId(), currrentUser);
    }

    @DeleteMapping("/{projectId}/members/{userId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeMember(
            @PathVariable UUID projectId,
            @PathVariable UUID userId,
            @RequestAttribute("currentUser") User currentUser
    ) {
        projectService.removeMember(projectId, userId, currentUser);
    }
}
