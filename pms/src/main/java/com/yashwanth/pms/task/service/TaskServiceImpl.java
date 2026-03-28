package com.yashwanth.pms.task.service;

import com.yashwanth.pms.common.exception.AccessDeniedException;
import com.yashwanth.pms.common.exception.ResourceNotFoundException;
import com.yashwanth.pms.events.TaskAssignedEvent;
import com.yashwanth.pms.events.TaskStatusChangedEvent;
import com.yashwanth.pms.project.domain.Project;
import com.yashwanth.pms.project.repository.ProjectRepository;
import com.yashwanth.pms.project.service.ProjectService;
import com.yashwanth.pms.task.domain.Task;
import com.yashwanth.pms.task.domain.TaskPriority;
import com.yashwanth.pms.task.domain.TaskStatus;
import com.yashwanth.pms.task.repository.TaskRepository;
import com.yashwanth.pms.user.domain.Role;
import com.yashwanth.pms.user.domain.User;
import com.yashwanth.pms.user.service.UserService;
import org.springframework.context.ApplicationEvent;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final ProjectService projectService;
    private final UserService userService;
    private final ApplicationEventPublisher publisher;

    public TaskServiceImpl(TaskRepository taskRepository, ProjectService projectService, UserService userService, ApplicationEventPublisher publisher) {
        this.taskRepository = taskRepository;
        this.projectService = projectService;
        this.userService = userService;
        this.publisher = publisher;
    }

    @Override
    public Task createTask(UUID projectId, String title, String description, String priority, UUID creatorId) {

        User creator = userService.getById(creatorId);

        if (creator.getRole() == Role.TEAM_MEMBER) {
            throw new AccessDeniedException("Team members cannot create tasks");
        }

        Project project = projectService.getById(projectId);

        Task task = new Task(title, description, TaskPriority.valueOf(priority), project, creator);

        return taskRepository.save(task);
    }

    @Override
    public void assignTask(UUID taskId, UUID assigneeId, UUID currentUserId) {
        User currentUser = userService.getById(currentUserId);

        if (currentUser.getRole() == Role.TEAM_MEMBER) {
            throw new AccessDeniedException("Not allowed to assign tasks");
        }

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        User assignee = userService.getById(assigneeId);

        task.assignTo(assignee);
        taskRepository.save(task);

        publisher.publishEvent(
                new TaskAssignedEvent(taskId, assigneeId, task.getTitle())
        );
    }

    @Override
    public List<Task> getTasksByProject(UUID projectId) {

        Project project = projectService.getById(projectId);

        return taskRepository.findByProject(project);
    }

    @Override
    public void changeTaskStatus(UUID taskId, String newStatus, UUID currentUserId) {
        Task task = taskRepository.findById(taskId).orElseThrow(() -> new ResourceNotFoundException("No task found"));

        User user = userService.getById(currentUserId);

        if (user.getRole() == Role.TEAM_MEMBER &&
                (task.getAssignee() == null ||
                        !task.getAssignee().getId().equals(currentUserId))) {

            throw new AccessDeniedException(
                    "You are not allowed to change this task status");
        }

        TaskStatus currentStatus = task.getStatus();
        TaskStatus targetStatus = TaskStatus.valueOf(newStatus);
        task.changeStatus(targetStatus);

        taskRepository.save(task);

        publisher.publishEvent(new TaskStatusChangedEvent(task.getId(), task.getCreatedBy().getId(), currentStatus, targetStatus, "%s(%s)".formatted(task.getAssignee().getName(), task.getAssignee().getEmail()), task.getTitle()));
    }

    @Override
    public Task getById(UUID taskId) {
        return taskRepository.findById(taskId).orElseThrow(() -> new ResourceNotFoundException("Task does not exist."));
    }

    @Override
    public List<Task> getTasksByMember(UUID projectId, UUID userId) {

        return taskRepository.findByProjectIdAndAssigneeId(projectId, userId);

    }
}
