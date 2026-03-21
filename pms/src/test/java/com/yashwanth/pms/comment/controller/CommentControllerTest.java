package com.yashwanth.pms.comment.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.yashwanth.pms.comment.domain.Comment;
import com.yashwanth.pms.comment.dto.AddCommentRequest;
import com.yashwanth.pms.comment.service.CommentService;
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
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(CommentController.class)
@AutoConfigureMockMvc(addFilters = false)
class CommentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private CommentService commentService;

    @MockitoBean
    private JwtUtil jwtUtil;

    @MockitoBean
    private CustomUserDetailsService customUserDetailsService;

    @Autowired
    private ObjectMapper objectMapper;

    /* =========================
       ADD COMMENT TO TASK
       ========================= */

    @Test
    void addCommentToTask_returns201() throws Exception {

        AddCommentRequest request = new AddCommentRequest();
        request.setContent("Task comment");

        when(commentService.addTaskComment(any(), any(), any()))
                .thenReturn(dummyTaskComment());

        mockMvc.perform(post("/api/tasks/{taskId}/comments", UUID.randomUUID())
                        .principal(mockPrincipal())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.content").value("Task comment"));
    }

    /* =========================
       GET TASK COMMENTS
       ========================= */

    @Test
    void getTaskComments_returns200() throws Exception {

        when(commentService.getCommentsForTask(any()))
                .thenReturn(List.of(dummyTaskComment()));

        mockMvc.perform(get("/api/tasks/{taskId}/comments", UUID.randomUUID()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));
    }

    /* =========================
       ADD COMMENT TO ISSUE
       ========================= */

    @Test
    void addCommentToIssue_returns201() throws Exception {

        AddCommentRequest request = new AddCommentRequest();
        request.setContent("Issue comment");

        when(commentService.addIssueComment(any(), any(), any()))
                .thenReturn(dummyIssueComment());

        mockMvc.perform(post("/api/issues/{issueId}/comments", UUID.randomUUID())
                        .principal(mockPrincipal())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.content").value("Issue comment"));
    }

    /* =========================
       GET ISSUE COMMENTS
       ========================= */

    @Test
    void getIssueComments_returns200() throws Exception {

        when(commentService.getCommentsForIssue(any()))
                .thenReturn(List.of(dummyIssueComment()));

        mockMvc.perform(get("/api/issues/{issueId}/comments", UUID.randomUUID()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));
    }

    /* =========================
       HELPERS
       ========================= */

    private Authentication mockPrincipal() {

        User user = new User("User", "u@test.com", "pwd", Role.TEAM_MEMBER);
        user.setId(UUID.randomUUID());

        UserPrincipal principal = new UserPrincipal(user);

        return new UsernamePasswordAuthenticationToken(
                principal,
                null,
                principal.getAuthorities()
        );
    }

    private Comment dummyTaskComment() {

        User author = new User("User", "u@test.com", "pwd", Role.TEAM_MEMBER);
        author.setId(UUID.randomUUID());

        Project project = new Project(
                "Project",
                new User("Leader", "l@test.com", "pwd", Role.PROJECT_LEADER));

        Task task = new Task(
                "Task",
                "Desc",
                TaskPriority.MEDIUM,
                project,
                project.getLeader()
        );

        return Comment.forTask("Task comment", author, task);
    }

    private Comment dummyIssueComment() {

        User author = new User("User", "u@test.com", "pwd", Role.TEAM_MEMBER);
        author.setId(UUID.randomUUID());

        Project project = new Project(
                "Project",
                new User("Leader", "l@test.com", "pwd", Role.PROJECT_LEADER));

        return Comment.forIssue("Issue comment", author, null);
    }
}
