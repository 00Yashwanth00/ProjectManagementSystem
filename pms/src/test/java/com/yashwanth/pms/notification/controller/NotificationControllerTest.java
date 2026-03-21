package com.yashwanth.pms.notification.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.yashwanth.pms.notification.service.NotificationService;
import com.yashwanth.pms.security.CustomUserDetailsService;
import com.yashwanth.pms.security.JwtUtil;
import com.yashwanth.pms.security.UserPrincipal;
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
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

@WebMvcTest(NotificationController.class)
@AutoConfigureMockMvc(addFilters = false)
class NotificationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private NotificationService notificationService;

    @MockitoBean
    private JwtUtil jwtUtil;

    @MockitoBean
    private CustomUserDetailsService customUserDetailsService;

    @Autowired
    private ObjectMapper objectMapper;

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

    @Test
    void getNotifications_returns200() throws Exception {

        when(notificationService.getUserNotifications(any()))
                .thenReturn(List.of());

        mockMvc.perform(
                        get("/api/notifications")
                                .principal(mockPrincipal(Role.TEAM_MEMBER))
                                .accept(MediaType.APPLICATION_JSON)
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    void markRead_returns204() throws Exception {

        mockMvc.perform(
                        patch("/api/notifications/{id}/read",
                                UUID.randomUUID())
                                .principal(mockPrincipal(Role.TEAM_MEMBER))
                )
                .andExpect(status().isNoContent());
    }
}