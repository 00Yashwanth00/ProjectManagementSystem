package com.yashwanth.pms.task.service;

import com.yashwanth.pms.common.exception.AccessDeniedException;
import com.yashwanth.pms.common.exception.ResourceNotFoundException;
import com.yashwanth.pms.project.domain.Project;
import com.yashwanth.pms.project.repository.ProjectRepository;
import com.yashwanth.pms.project.service.ProjectService;
import com.yashwanth.pms.task.domain.Task;
import com.yashwanth.pms.task.domain.TaskPriority;
import com.yashwanth.pms.task.repository.TaskRepository;
import com.yashwanth.pms.user.domain.Role;
import com.yashwanth.pms.user.domain.User;
import com.yashwanth.pms.user.service.UserService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class TaskServiceTest {


    @Mock
    private TaskRepository taskRepository;

    @Mock
    private ProjectService projectService;

    @Mock
    private UserService userService;

    @InjectMocks
    private TaskServiceImpl taskService;

    @Mock
    private ProjectRepository projectRepository;

    @Test
    void leaderCreateTask() {

        UUID projectId = UUID.randomUUID();
        UUID leaderId = UUID.randomUUID();

        User leader = new User("leader", "leader@test.com", "pwd", Role.PROJECT_LEADER);

        Project project = new Project("Test Project", leader);

        when(userService.getById(leaderId)).thenReturn(leader);
        when(projectService.getById(projectId)).thenReturn(project);
        when(taskRepository.save(any(Task.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Task task = taskService.createTask(
                projectId,
                "Task 1",
                "Description",
                "HIGH",
                leaderId
        );

        assertEquals("Task 1", task.getTitle());
        assertEquals(TaskPriority.HIGH, task.getPriority());
        assertEquals(project, task.getProject());
    }

    @Test
    void teamMemberCannotCreateTask() {
        UUID projectId = UUID.randomUUID();
        UUID memberId = UUID.randomUUID();

        User member = new User("Member", "m@test.com", "pwd", Role.TEAM_MEMBER);

        when(userService.getById(memberId)).thenReturn(member);

        assertThrows(AccessDeniedException.class, () -> {
            taskService.createTask(
                    projectId,
                    "Task",
                    "Desc",
                    "LOW",
                    memberId
            );
        });
    }

    @Test
    void cannotCreateTaskIfProjectNotFound() {
        UUID projectId = UUID.randomUUID();
        UUID adminId = UUID.randomUUID();

        User admin = new User("Admin", "admin@test.com", "pwd", Role.ADMIN);

        when(userService.getById(adminId)).thenReturn(admin);
        when(projectRepository.findById(projectId))
                .thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () ->
                taskService.createTask(
                        projectId,
                        "Task",
                        "Desc",
                        "MEDIUM",
                        adminId
                )
        );
    }

    @Test
    void leaderCanAssignTask() {
        UUID taskId = UUID.randomUUID();
        UUID leaderId = UUID.randomUUID();
        UUID assigneeId = UUID.randomUUID();

        User leader = new User("Leader", "l@test.com", "pwd", Role.PROJECT_LEADER);
        User member = new User("Member", "m@test.com", "pwd", Role.TEAM_MEMBER);
        Task task = new Task(
                "Task",
                "Desc",
                TaskPriority.MEDIUM,
                new Project("P", leader),
                leader
        );

        when(userService.getById(leaderId)).thenReturn(leader);
        when(userService.getById(assigneeId)).thenReturn(member);
        when(taskRepository.findById(taskId))
                .thenReturn(Optional.of(task));

        taskService.assignTask(taskId, assigneeId, leaderId);

        assertEquals(member, task.getAssignee());
    }

    @Test
    void teamMemberCannotAssignTask() {
        UUID taskId = UUID.randomUUID();
        UUID memberId = UUID.randomUUID();

        User member = new User("Member", "m@test.com", "pwd", Role.TEAM_MEMBER);

        when(userService.getById(memberId)).thenReturn(member);

        assertThrows(AccessDeniedException.class, () ->
                taskService.assignTask(
                        taskId,
                        UUID.randomUUID(),
                        memberId
                )
        );
    }
}
