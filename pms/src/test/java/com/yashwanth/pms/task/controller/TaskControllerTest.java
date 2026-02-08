package com.yashwanth.pms.task.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.yashwanth.pms.project.domain.Project;
import com.yashwanth.pms.security.CustomUserDetailsService;
import com.yashwanth.pms.security.JwtUtil;
import com.yashwanth.pms.security.UserPrincipal;
import com.yashwanth.pms.task.domain.Task;
import com.yashwanth.pms.task.domain.TaskPriority;
import com.yashwanth.pms.task.dto.ChangeTaskStatusRequest;
import com.yashwanth.pms.task.dto.CreateTaskRequest;
import com.yashwanth.pms.task.service.TaskService;
import com.yashwanth.pms.user.domain.Role;
import com.yashwanth.pms.user.domain.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultMatcher;

import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(TaskController.class)
@AutoConfigureMockMvc(addFilters = false)
class TaskControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private TaskService taskService;

    @MockitoBean
    private JwtUtil jwtUtil;

    @MockitoBean
    private CustomUserDetailsService customUserDetailsService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void createTask_returns201() throws Exception {
        UUID projectId = UUID.randomUUID();

        CreateTaskRequest request = new CreateTaskRequest();
        request.setTitle("Test Task");
        request.setDescription("Desc");
        request.setPriority("HIGH");

        when(taskService.createTask(
                any(), anyString(), anyString(), anyString(), any()
        )).thenReturn(dummyTask());

        mockMvc.perform(post("/api/projects/{projectId}/tasks", projectId)
                .principal(mockPrincipal(Role.ADMIN))
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsBytes(request))

        ).andExpect(status().isCreated());
    }

    @Test
    void assignTask_returns204() throws Exception {

        mockMvc.perform(post(
                        "/api/projects/{projectId}/tasks/{taskId}/assign/{userId}",
                        UUID.randomUUID(),
                        UUID.randomUUID(),
                        UUID.randomUUID())
                        .principal(mockPrincipal(Role.PROJECT_LEADER)))
                .andExpect(status().isNoContent());
    }

    @Test
    void changeTaskStatus_returns204() throws Exception {

        ChangeTaskStatusRequest request = new ChangeTaskStatusRequest();
        request.setStatus("IN_PROGRESS");

        mockMvc.perform(patch(
                        "/api/projects/{projectId}/tasks/{taskId}/status",
                        UUID.randomUUID(),
                        UUID.randomUUID())
                        .principal(mockPrincipal(Role.TEAM_MEMBER))
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNoContent());
    }

    @Test
    void getTasks_returns200() throws Exception {
        when(taskService.getTasksByProject(any()))
                .thenReturn(List.of(dummyTask()));

        mockMvc.perform(get("/api/projects/{projectId}/tasks", UUID.randomUUID())
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].title").value("Task")); // Extra check for your data
    }

    private Authentication mockPrincipal(Role role) {
        User user = new User("User", "u@test.com", "pwd", role);

        UserPrincipal principal = new UserPrincipal(user);

        return new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());
    }

    private Task dummyTask() {
        User leader = new User("Leader", "l@test.com", "pwd", Role.PROJECT_LEADER);
        Project project = new Project("Project", leader);

        Task task = new Task(
                "Task",
                "Desc",
                TaskPriority.HIGH,
                project,
                leader
        );

        return task;
    }

}