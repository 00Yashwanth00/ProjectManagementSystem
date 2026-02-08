//package com.yashwanth.pms.project.service;
//
//import com.yashwanth.pms.project.domain.Project;
//import com.yashwanth.pms.project.domain.ProjectStatus;
//import com.yashwanth.pms.project.repository.ProjectRepository;
//import com.yashwanth.pms.project.service.ProjectServiceImpl;
//import com.yashwanth.pms.user.domain.Role;
//import com.yashwanth.pms.user.domain.User;
//import com.yashwanth.pms.user.service.UserService;
//import org.junit.jupiter.api.Test;
//import org.junit.jupiter.api.extension.ExtendWith;
//import org.mockito.InjectMocks;
//import org.mockito.Mock;
//import org.mockito.junit.jupiter.MockitoExtension;
//
//import java.util.Optional;
//import java.util.UUID;
//
//import static org.junit.jupiter.api.Assertions.*;
//import static org.mockito.ArgumentMatchers.any;
//import static org.mockito.Mockito.when;
//
//@ExtendWith(MockitoExtension.class)
//class ProjectServiceTest {
//
//    @Mock
//    private ProjectRepository projectRepository;
//
//    @Mock
//    private UserService userService;
//
//    @InjectMocks
//    private ProjectServiceImpl projectService;
//
//    /* =========================
//       CREATE PROJECT TESTS
//       ========================= */
//
//    @Test
//    void adminCanCreateProjectAndAssignLeader() {
//        User admin = new User("Admin", "admin@test.com", Role.ADMIN);
//        User leader = new User("Leader", "leader@test.com", Role.PROJECT_LEADER);
//
//        when(userService.getById(leader.getId()))
//                .thenReturn(leader);
//
//        when(projectRepository.save(any(Project.class)))
//                .thenAnswer(invocation -> invocation.getArgument(0));
//
//        Project project = projectService.createProject(
//                "Test Project",
//                leader.getId(),
//                admin
//        );
//
//        assertEquals("Test Project", project.getName());
//        assertEquals(ProjectStatus.ACTIVE, project.getStatus());
//        assertEquals(leader, project.getLeader());
//        assertTrue(project.getMembers().contains(leader));
//    }
//
//    @Test
//    void nonAdminCannotCreateProject() {
//        User leader = new User("Leader", "leader@test.com", Role.PROJECT_LEADER);
//        User member = new User("Member", "member@test.com", Role.TEAM_MEMBER);
//
//        assertThrows(IllegalStateException.class, () ->
//                projectService.createProject("Test", leader.getId(), member)
//        );
//    }
//
//    @Test
//    void adminCannotAssignNonLeaderAsProjectLeader() {
//        User admin = new User("Admin", "admin@test.com", Role.ADMIN);
//        User member = new User("Member", "member@test.com", Role.TEAM_MEMBER);
//
//        when(userService.getById(member.getId()))
//                .thenReturn(member);
//
//        assertThrows(IllegalStateException.class, () ->
//                projectService.createProject("Test", member.getId(), admin)
//        );
//    }
//
//    /* =========================
//       ADD MEMBER TESTS
//       ========================= */
//
//    @Test
//    void adminCanAddMember() {
//        User admin = new User("Admin", "admin@test.com", Role.ADMIN);
//        User leader = new User("Leader", "leader@test.com", Role.PROJECT_LEADER);
//        User member = new User("Member", "member@test.com", Role.TEAM_MEMBER);
//
//        Project project = new Project("Test", leader);
//
//        when(projectRepository.findById(any()))
//                .thenReturn(Optional.of(project));
//
//        when(userService.getById(member.getId()))
//                .thenReturn(member);
//
//        projectService.addMember(project.getId(), member.getId(), admin);
//
//        assertTrue(project.getMembers().contains(member));
//    }
//
//    @Test
//    void leaderCanAddMember() {
//        User leader = new User("Leader", "leader@test.com", Role.PROJECT_LEADER);
//        User member = new User("Member", "member@test.com", Role.TEAM_MEMBER);
//
//        Project project = new Project("Test", leader);
//
//        when(projectRepository.findById(any()))
//                .thenReturn(Optional.of(project));
//
//        when(userService.getById(member.getId()))
//                .thenReturn(member);
//
//        projectService.addMember(project.getId(), member.getId(), leader);
//
//        assertTrue(project.getMembers().contains(member));
//    }
//
//    @Test
//    void memberCannotAddMember() {
//        User leader = new User("Leader", "leader@test.com", Role.PROJECT_LEADER);
//        User member = new User("Member", "member@test.com", Role.TEAM_MEMBER);
//
//        Project project = new Project("Test", leader);
//
//        when(projectRepository.findById(any()))
//                .thenReturn(Optional.of(project));
//
//        assertThrows(IllegalStateException.class, () ->
//                projectService.addMember(project.getId(), member.getId(), member)
//        );
//    }
//
//    /* =========================
//       REMOVE MEMBER TESTS
//       ========================= */
//
//    @Test
//    void adminCanRemoveMember() {
//        User admin = new User("Admin", "admin@test.com", Role.ADMIN);
//        User leader = new User("Leader", "leader@test.com", Role.PROJECT_LEADER);
//        User member = new User("Member", "member@test.com", Role.TEAM_MEMBER);
//
//        Project project = new Project("Test", leader);
//        project.getMembers().add(member);
//
//        when(projectRepository.findById(any()))
//                .thenReturn(Optional.of(project));
//
//        when(userService.getById(member.getId()))
//                .thenReturn(member);
//
//        projectService.removeMember(project.getId(), member.getId(), admin);
//
//        assertFalse(project.getMembers().contains(member));
//    }
//
//    @Test
//    void cannotRemoveProjectLeader() {
//        User admin = new User("Admin", "admin@test.com", Role.ADMIN);
//        User leader = new User("Leader", "leader@test.com", Role.PROJECT_LEADER);
//
//        Project project = new Project("Test", leader);
//
//        when(projectRepository.findById(any()))
//                .thenReturn(Optional.of(project));
//
//        when(userService.getById(leader.getId()))
//                .thenReturn(leader);
//
//        assertThrows(IllegalStateException.class, () ->
//                projectService.removeMember(project.getId(), leader.getId(), admin)
//        );
//    }
//}
