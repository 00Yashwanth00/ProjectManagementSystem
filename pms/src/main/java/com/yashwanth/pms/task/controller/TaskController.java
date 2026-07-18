package com.yashwanth.pms.task.controller;

import com.yashwanth.pms.common.exception.AccessDeniedException;
import com.yashwanth.pms.project.domain.Project;
import com.yashwanth.pms.project.service.ProjectService;
import com.yashwanth.pms.security.UserPrincipal;
import com.yashwanth.pms.task.dto.ChangeTaskStatusRequest;
import com.yashwanth.pms.task.dto.CreateTaskRequest;
import com.yashwanth.pms.task.dto.TaskResponse;
import com.yashwanth.pms.task.service.TaskService;
import com.yashwanth.pms.user.domain.User;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/projects/{projectId}/tasks")
public class TaskController {

    private final TaskService taskService;
    private final ProjectService projectService;

    public TaskController(TaskService taskService, ProjectService projectService) {
        this.taskService = taskService;
        this.projectService = projectService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TaskResponse createTask(
            @PathVariable UUID projectId,
            @Valid @RequestBody CreateTaskRequest request,
            Authentication authentication
    ) {
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();

        Project project = projectService.getById(projectId);

        // ✅ Only Project Leader can create tasks (ADMIN check is in service)
        if (!project.getLeader().getId().equals(principal.getId())) {
            throw new AccessDeniedException("You are not allowed to create task. Only Project Leader can create tasks.");
        }

        // ✅ Pass assigneeId from request to service
        return TaskResponse.from(
                taskService.createTask(
                        projectId,
                        request.getTitle(),
                        request.getDescription(),
                        request.getPriority(),
                        request.getAssigneeId(),  // ✅ Pass assigneeId
                        principal.getId()
                )
        );
    }

    @PostMapping("/{taskId}/assign/{userId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void assignTask(
            @PathVariable UUID projectId,
            @PathVariable UUID taskId,
            @PathVariable UUID userId,
            Authentication authentication
    ) {
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();

        Project project = projectService.getById(projectId);

        if (!project.getLeader().getId().equals(principal.getId())) {
            throw new AccessDeniedException("You are not allowed to assign task. Only Project Leader can assign tasks.");
        }

        taskService.assignTask(
                taskId,
                userId,
                principal.getId()
        );
    }

    @GetMapping
    public List<TaskResponse> getTasks(
            @PathVariable UUID projectId
    ) {
        return taskService.getTasksByProject(projectId)
                .stream()
                .map(TaskResponse::from)
                .toList();
    }

    @GetMapping("/{taskId}")
    public TaskResponse getTask(@PathVariable UUID projectId, @PathVariable UUID taskId) {
        return TaskResponse.from(taskService.getById(taskId));
    }

    @GetMapping("/users/{userId}")
    public List<TaskResponse> getTasksOfMember(
            @PathVariable UUID projectId,
            @PathVariable UUID userId,
            Authentication authentication
    ) {
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();

        return taskService.getTasksByMember(projectId, principal.getId()).stream()
                .map(TaskResponse::from)
                .toList();
    }

    @PatchMapping("/{taskId}/status")
    @PreAuthorize("isAuthenticated()")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void changeTaskStatus(
            @PathVariable UUID taskId,
            @Valid @RequestBody ChangeTaskStatusRequest request,
            Authentication authentication
    ) {
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();

        taskService.changeTaskStatus(taskId, request.getStatus(), principal.getId());
    }
}