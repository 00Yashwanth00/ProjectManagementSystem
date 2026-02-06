package com.yashwanth.pms.task.controller;

import com.yashwanth.pms.security.UserPrincipal;
import com.yashwanth.pms.task.dto.CreateTaskRequest;
import com.yashwanth.pms.task.dto.TaskResponse;
import com.yashwanth.pms.task.service.TaskService;
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

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','PROJECT_LEADER')")
    @ResponseStatus(HttpStatus.CREATED)
    public TaskResponse createTask(
            @PathVariable UUID projectId,
            @Valid @RequestBody CreateTaskRequest request,
            Authentication authentication
    ) {
        UserPrincipal principal =
                (UserPrincipal) authentication.getPrincipal();

        return TaskResponse.from(
                taskService.createTask(
                        projectId,
                        request.getTitle(),
                        request.getDescription(),
                        request.getPriority(),
                        principal.getId()
                )
        );
    }

    @PostMapping("/{taskId}/assign/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN','PROJECT_LEADER')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void assignTask(
            @PathVariable UUID taskId,
            @PathVariable UUID userId,
            Authentication authentication
    ) {
        UserPrincipal principal =
                (UserPrincipal) authentication.getPrincipal();

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
}

