package com.yashwanth.pms.issue.service;

import com.yashwanth.pms.common.exception.AccessDeniedException;
import com.yashwanth.pms.common.exception.ResourceNotFoundException;
import com.yashwanth.pms.issue.domain.Issue;
import com.yashwanth.pms.issue.domain.IssuePriority;
import com.yashwanth.pms.issue.domain.IssueStatus;
import com.yashwanth.pms.issue.domain.IssueType;
import com.yashwanth.pms.issue.repository.IssueRepository;
import com.yashwanth.pms.project.domain.Project;
import com.yashwanth.pms.project.service.ProjectService;
import com.yashwanth.pms.task.service.TaskService;
import com.yashwanth.pms.user.domain.Role;
import com.yashwanth.pms.user.domain.User;
import com.yashwanth.pms.user.service.UserService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class IssueServiceTest {

    @Mock
    private IssueRepository issueRepository;

    @Mock
    private ProjectService projectService;

    @Mock
    private UserService userService;

    @Mock
    private TaskService taskService;

    @InjectMocks
    private IssueServiceImpl issueService;

    @Test
    void userCanCreateIssue() {
        UUID projectId = UUID.randomUUID();
        UUID reporterId = UUID.randomUUID();

        User reporter = new User("User", "u@test.com", "pwd", Role.TEAM_MEMBER);
        Project project = new Project("Project",
                new User("Leader", "l@test.com", "pwd", Role.PROJECT_LEADER));

        when(userService.getById(reporterId)).thenReturn(reporter);
        when(projectService.getById(projectId))
                .thenReturn(project);
        when(issueRepository.save(any(Issue.class))).thenAnswer(inv -> inv.getArgument(0));

        Issue issue = issueService.createIssue(
                projectId,
                null,
                "Bug title",
                "Bug desc",
                "BUG",
                "HIGH",
                reporterId
        );

        assertEquals(IssueStatus.OPEN, issue.getStatus());
        assertEquals(IssueType.BUG, issue.getType());
        assertEquals(project, issue.getProject());
    }

    @Test
    void cannotCreateIssueIfProjectNotFound() {
        UUID reporterId = UUID.randomUUID();

        when(userService.getById(reporterId)).thenReturn(new User("U", "u@test.com", "pwd", Role.TEAM_MEMBER));
        when(projectService.getById(any())).thenThrow(new ResourceNotFoundException("Project does not exist"));

        assertThrows(ResourceNotFoundException.class, () -> issueService.createIssue(
                UUID.randomUUID(),
                null,
                "Bug",
                "Desc",
                "BUG",
                "LOW",
                reporterId
        ));
    }

    @Test
    void leaderCanAssignIssue() {
        UUID issueId = UUID.randomUUID();
        UUID leaderId = UUID.randomUUID();
        UUID assigneeId = UUID.randomUUID();

        User leader = new User("Leader", "l@test.com", "pwd", Role.PROJECT_LEADER);
        User assignee = new User("Member", "m@test.com", "pwd", Role.TEAM_MEMBER);

        Issue issue = dummyIssue(leader);

        when(userService.getById(leaderId)).thenReturn(leader);
        when(userService.getById(assigneeId)).thenReturn(assignee);
        when(issueRepository.findById(issueId))
                .thenReturn(Optional.of(issue));

        issueService.assignIssue(issueId, assigneeId, leaderId);

        assertEquals(assignee, issue.getAssignee());
    }

    @Test
    void teamMemberCannotAssignIssue() {
        UUID memberId = UUID.randomUUID();

        when(userService.getById(memberId))
                .thenReturn(new User("M", "m@test.com", "pwd", Role.TEAM_MEMBER));

        assertThrows(AccessDeniedException.class, () ->
                issueService.assignIssue(
                        UUID.randomUUID(),
                        UUID.randomUUID(),
                        memberId
                )
        );
    }

    private Issue dummyIssue(User reporter) {
        return new Issue(
                "Issue",
                "Desc",
                IssueType.BUG,
                IssuePriority.HIGH,
                new Project("P", reporter),
                null,
                reporter
        );
    }

    @Test
    void assigneeCanMoveIssueToInProgress() {
        UUID issueId = UUID.randomUUID();
        UUID assigneeId = UUID.randomUUID();


        User assignee = new User("M", "m@test.com", "pwd", Role.TEAM_MEMBER);
        assignee.setId(assigneeId);

        Issue issue = dummyIssue(assignee);

        issue.assignTo(assignee);

        when(userService.getById(assigneeId)).thenReturn(assignee);
        when(issueRepository.findById(issueId))
                .thenReturn(Optional.of(issue));

        issueService.changeIssueStatus(issueId, "IN_PROGRESS", assigneeId);

        assertEquals(IssueStatus.IN_PROGRESS, issue.getStatus());
    }

    @Test
    void teamMemberCannotChangeStatusIfNotAssignee() {
        UUID issueId = UUID.randomUUID();
        UUID memberId = UUID.randomUUID();

        User member = new User("M", "m@test.com", "pwd", Role.TEAM_MEMBER);
        Issue issue = dummyIssue(member);

        when(userService.getById(memberId)).thenReturn(member);
        when(issueRepository.findById(issueId))
                .thenReturn(Optional.of(issue));

        assertThrows(AccessDeniedException.class, () ->
                issueService.changeIssueStatus(issueId, "IN_PROGRESS", memberId)
        );
    }

    @Test
    void cannotSkipIssueStatusFlow() {
        UUID issueId = UUID.randomUUID();
        UUID adminId = UUID.randomUUID();

        User admin = new User("Admin", "a@test.com", "pwd", Role.ADMIN);
        Issue issue = dummyIssue(admin);

        when(userService.getById(adminId)).thenReturn(admin);
        when(issueRepository.findById(issueId))
                .thenReturn(Optional.of(issue));

        assertThrows(IllegalStateException.class, () ->
                issueService.changeIssueStatus(issueId, "RESOLVED", adminId)
        );
    }

    @Test
    void getIssuesByProject() {
        Project project = new Project(
                "Project",
                new User("Leader", "l@test.com", "pwd", Role.PROJECT_LEADER));

        when(projectService.getById(any())).thenReturn(project);
        when(issueRepository.findByProject(project))
                .thenReturn(List.of(dummyIssue(project.getLeader())));

        List<Issue> issues =
                issueService.getIssuesByProject(UUID.randomUUID());

        assertEquals(1, issues.size());
    }
}