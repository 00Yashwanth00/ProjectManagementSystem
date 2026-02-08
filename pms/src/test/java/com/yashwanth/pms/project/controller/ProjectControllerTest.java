//package com.yashwanth.pms.project.controller;
//
//import com.fasterxml.jackson.databind.ObjectMapper;
//import com.yashwanth.pms.project.domain.Project;
//import com.yashwanth.pms.project.dto.CreateProjectRequest;
//import com.yashwanth.pms.project.service.ProjectService;
//import com.yashwanth.pms.user.domain.Role;
//import com.yashwanth.pms.user.domain.User;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
//import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
//import org.springframework.http.MediaType;
//import org.springframework.test.context.bean.override.mockito.MockitoBean;
//import org.springframework.test.web.servlet.MockMvc;
//
//import java.util.UUID;
//
//import static org.mockito.ArgumentMatchers.any;
//import static org.mockito.ArgumentMatchers.anyString;
//import static org.mockito.Mockito.when;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
//
//@WebMvcTest(ProjectController.class)
//@AutoConfigureMockMvc(addFilters = false)
//public class ProjectControllerTest {
//
//    @Autowired
//    private MockMvc mockMvc;
//
//    @MockitoBean
//    private ProjectService projectService;
//
//    @Autowired
//    private ObjectMapper objectMapper;
//
//    /* =========================
//       CREATE PROJECT
//       ========================= */
//
//    @Test
//    void createProject_returns201() throws Exception {
//
//        CreateProjectRequest request = new CreateProjectRequest();
//        request.setName("Test Project");
//        request.setLeaderId(UUID.randomUUID());
//
//        when(projectService.createProject(anyString(), any(), any()))
//                .thenReturn(dummyProject());
//
//        mockMvc.perform(post("/api/projects")
//                        .requestAttr("currentUser",
//                                new User("Admin", "admin@test.com", Role.ADMIN))
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(request)))
//                .andExpect(status().isCreated());
//    }
//
//    /* =========================
//       ADD MEMBER
//       ========================= */
//
//    @Test
//    void addMember_returns204() throws Exception {
//
//
//        mockMvc.perform(post("/api/projects/{id}/members", UUID.randomUUID())
//                .requestAttr("currentUser", new User("Admin", "a@test.com", Role.ADMIN))
//                .contentType(MediaType.APPLICATION_JSON)
//                .content("""
//                        {
//                            "userId": "%s"
//                        }""".formatted(UUID.randomUUID())))
//                .andExpect(status().isNoContent());
//    }
//
//    @Test
//    void removeMember_returns204() throws Exception {
//
//        mockMvc.perform(delete("/api/projects/{id}/members/{userId}",
//                        UUID.randomUUID(), UUID.randomUUID())
//                        .requestAttr("currentUser",
//                                new User("Admin", "admin@test.com", Role.ADMIN)))
//                .andExpect(status().isNoContent());
//    }
//
//    private Project dummyProject() {
//        User leader = new User("Leader", "leader@test.com", Role.PROJECT_LEADER);
//        return new Project("Test Project", leader);
//    }
//}
