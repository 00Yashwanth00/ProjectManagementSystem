package com.yashwanth.pms.task.service;

import com.yashwanth.pms.common.exception.AccessDeniedException;
import com.yashwanth.pms.common.exception.BusinessException;
import com.yashwanth.pms.common.exception.ResourceNotFoundException;
import com.yashwanth.pms.events.TaskAssignedEvent;
import com.yashwanth.pms.events.TaskStatusChangedEvent;
import com.yashwanth.pms.project.domain.Project;
import com.yashwanth.pms.project.service.ProjectService;
import com.yashwanth.pms.task.domain.Task;
import com.yashwanth.pms.task.domain.TaskPriority;
import com.yashwanth.pms.task.domain.TaskStatus;
import com.yashwanth.pms.task.repository.TaskRepository;
import com.yashwanth.pms.user.domain.Role;
import com.yashwanth.pms.user.domain.User;
import com.yashwanth.pms.user.service.UserService;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class TaskServiceImpl implements TaskService {

    private static final int MAX_TASKS_PER_MEMBER = 3;

    private final TaskRepository taskRepository;
    private final ProjectService projectService;
    private final UserService userService;
    private final ApplicationEventPublisher publisher;

    public TaskServiceImpl(TaskRepository taskRepository,
                           ProjectService projectService,
                           UserService userService,
                           ApplicationEventPublisher publisher) {
        this.taskRepository = taskRepository;
        this.projectService = projectService;
        this.userService = userService;
        this.publisher = publisher;
    }

    @Override
    @Transactional
    public Task createTask(UUID projectId, String title, String description, String priority, UUID assigneeId, UUID creatorId) {

        User creator = userService.getById(creatorId);
        Project project = projectService.getById(projectId);

        // ✅ Only ADMIN or PROJECT_LEADER can create tasks
        if (creator.getRole() != Role.ADMIN) {
            if (project.getLeader() == null || !project.getLeader().getId().equals(creatorId)) {
                throw new AccessDeniedException("Only ADMIN or Project Leader can create tasks");
            }
        }

        // ✅ Create the task
        Task task = new Task(title, description, TaskPriority.valueOf(priority), project, creator);

        // ✅ Assign the task if assigneeId is provided
        if (assigneeId != null) {
            User assignee = userService.getById(assigneeId);

            // ✅ Prevent assigning to ADMIN
            if (assignee.getRole() == Role.ADMIN) {
                throw new BusinessException("Cannot assign task to ADMIN user");
            }

            // ✅ Check if assignee already has 3 tasks in this project
            long currentTaskCount = taskRepository.countByProjectIdAndAssigneeId(
                    project.getId(),
                    assigneeId
            );

            if (currentTaskCount >= MAX_TASKS_PER_MEMBER) {
                throw new BusinessException(
                        String.format("User already has %d tasks in this project. Maximum allowed is %d.",
                                currentTaskCount, MAX_TASKS_PER_MEMBER)
                );
            }

            task.assignTo(assignee);

            // ✅ Publish assignment event
            publisher.publishEvent(
                    new TaskAssignedEvent(task.getId(), assigneeId, task.getTitle())
            );
        }

        return taskRepository.save(task);
    }

    @Override
    @Transactional
    public void assignTask(UUID taskId, UUID assigneeId, UUID currentUserId) {
        User currentUser = userService.getById(currentUserId);

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        Project project = task.getProject();

        // ✅ Only ADMIN or PROJECT_LEADER of this project can assign tasks
        if (currentUser.getRole() != Role.ADMIN) {
            if (project.getLeader() == null || !project.getLeader().getId().equals(currentUserId)) {
                throw new AccessDeniedException("Only ADMIN or Project Leader can assign tasks");
            }
        }

        User assignee = userService.getById(assigneeId);

        // ✅ Prevent assigning to ADMIN
        if (assignee.getRole() == Role.ADMIN) {
            throw new BusinessException("Cannot assign task to ADMIN user");
        }

        // ✅ Check if assignee already has 3 tasks in this project
        long currentTaskCount = taskRepository.countByProjectIdAndAssigneeId(
                project.getId(),
                assigneeId
        );

        if (currentTaskCount >= MAX_TASKS_PER_MEMBER) {
            throw new BusinessException(
                    String.format("User already has %d tasks in this project. Maximum allowed is %d.",
                            currentTaskCount, MAX_TASKS_PER_MEMBER)
            );
        }

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
    @Transactional
    public void changeTaskStatus(UUID taskId, String newStatus, UUID currentUserId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("No task found"));

        User user = userService.getById(currentUserId);

        // ✅ Allow: ADMIN, PROJECT_LEADER, or the assignee
        boolean isAdmin = user.getRole() == Role.ADMIN;
        boolean isProjectLeader = task.getProject().getLeader() != null &&
                task.getProject().getLeader().getId().equals(currentUserId);
        boolean isAssignee = task.getAssignee() != null &&
                task.getAssignee().getId().equals(currentUserId);

        if (!isAdmin && !isProjectLeader && !isAssignee) {
            throw new AccessDeniedException(
                    "You are not allowed to change this task status"
            );
        }

        TaskStatus currentStatus = task.getStatus();
        TaskStatus targetStatus = TaskStatus.valueOf(newStatus);
        task.changeStatus(targetStatus);

        taskRepository.save(task);

        publisher.publishEvent(new TaskStatusChangedEvent(
                task.getId(),
                task.getCreatedBy().getId(),
                currentStatus,
                targetStatus,
                "%s(%s)".formatted(task.getAssignee() != null ? task.getAssignee().getName() : "Unassigned",
                        task.getAssignee() != null ? task.getAssignee().getEmail() : "N/A"),
                task.getTitle()
        ));
    }

    @Override
    public Task getById(UUID taskId) {
        return taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task does not exist."));
    }

    @Override
    public List<Task> getTasksByMember(UUID projectId, UUID userId) {
        return taskRepository.findByProjectIdAndAssigneeId(projectId, userId);
    }
}