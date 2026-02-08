package com.yashwanth.pms.issue.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.yashwanth.pms.issue.domain.*;
import com.yashwanth.pms.issue.dto.CreateIssueRequest;
import com.yashwanth.pms.issue.service.IssueService;
import com.yashwanth.pms.project.domain.Project;
import com.yashwanth.pms.security.CustomUserDetailsService;
import com.yashwanth.pms.security.JwtUtil;
import com.yashwanth.pms.security.UserPrincipal;
import com.yashwanth.pms.task.domain.Task;
import com.yashwanth.pms.task.domain.TaskPriority;
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

import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(IssueController.class)
@AutoConfigureMockMvc(addFilters = false)
class IssueControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private IssueService issueService;

    @MockitoBean
    private JwtUtil jwtUtil;

    @MockitoBean
    private CustomUserDetailsService customUserDetailsService;

    @Autowired
    private ObjectMapper objectMapper;

    /* =========================
       CREATE ISSUE
       ========================= */

    @Test
    void createIssue_returns201() throws Exception {

        UUID projectId = UUID.randomUUID();

        CreateIssueRequest request = new CreateIssueRequest();
        request.setTitle("Bug");
        request.setDescription("Bug desc");
        request.setType("BUG");
        request.setPriority("HIGH");

        when(issueService.createIssue(
                any(), any(), anyString(), anyString(),
                anyString(), anyString(), any()))
                .thenReturn(dummyIssue());

        mockMvc.perform(post("/api/projects/{projectId}/issues", projectId)
                        .principal(mockPrincipal(Role.TEAM_MEMBER))
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());
    }

    /* =========================
       ASSIGN ISSUE
       ========================= */

    @Test
    void assignIssue_returns204() throws Exception {

        mockMvc.perform(post(
                        "/api/projects/{projectId}/issues/{issueId}/assign/{userId}",
                        UUID.randomUUID(),
                        UUID.randomUUID(),
                        UUID.randomUUID())
                        .principal(mockPrincipal(Role.PROJECT_LEADER)))
                .andExpect(status().isNoContent());
    }

    /* =========================
       CHANGE ISSUE STATUS
       ========================= */

    @Test
    void changeIssueStatus_returns204() throws Exception {

        mockMvc.perform(patch(
                        "/api/projects/{projectId}/issues/{issueId}/status",
                        UUID.randomUUID(),
                        UUID.randomUUID())
                        .principal(mockPrincipal(Role.TEAM_MEMBER))
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(
                                Map.of("status", "IN_PROGRESS")
                        )))
                .andExpect(status().isNoContent());
    }

    /* =========================
       GET ISSUES
       ========================= */

    @Test
    void getIssues_returns200() throws Exception {

        when(issueService.getIssuesByProject(any()))
                .thenReturn(List.of(dummyIssue()));

        mockMvc.perform(get(
                        "/api/projects/{projectId}/issues",
                        UUID.randomUUID())
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(1));
    }

    /* =========================
       HELPERS
       ========================= */

    private Authentication mockPrincipal(Role role) {

        User user = new User(
                "User",
                "u@test.com",
                "pwd",
                role
        );

        user.setId(UUID.randomUUID());

        UserPrincipal principal = new UserPrincipal(user);

        return new UsernamePasswordAuthenticationToken(
                principal,
                null,
                principal.getAuthorities()
        );
    }

    private Issue dummyIssue() {

        User reporter = new User(
                "Reporter",
                "r@test.com",
                "pwd",
                Role.TEAM_MEMBER
        );
        reporter.setId(UUID.randomUUID());

        Project project = new Project(
                "Project",
                new User("Leader", "l@test.com", "pwd", Role.PROJECT_LEADER)
        );

        Task task = new Task(
                "Task",
                "Desc",
                TaskPriority.MEDIUM,
                project,
                project.getLeader()
        );

        return new Issue(
                "Issue",
                "Desc",
                IssueType.BUG,
                IssuePriority.HIGH,
                project,
                task,
                reporter
        );
    }
}
