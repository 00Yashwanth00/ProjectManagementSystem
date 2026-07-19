package com.yashwanth.pms.issue.service;

import com.yashwanth.pms.common.exception.AccessDeniedException;
import com.yashwanth.pms.common.exception.BusinessException;
import com.yashwanth.pms.common.exception.ResourceNotFoundException;
import com.yashwanth.pms.events.IssueAssignedEvent;
import com.yashwanth.pms.events.IssueStatusChangedEvent;
import com.yashwanth.pms.issue.domain.Issue;
import com.yashwanth.pms.issue.domain.IssuePriority;
import com.yashwanth.pms.issue.domain.IssueStatus;
import com.yashwanth.pms.issue.domain.IssueType;
import com.yashwanth.pms.issue.repository.IssueRepository;
import com.yashwanth.pms.project.domain.Project;
import com.yashwanth.pms.project.service.ProjectService;
import com.yashwanth.pms.task.domain.Task;
import com.yashwanth.pms.task.service.TaskService;
import com.yashwanth.pms.user.domain.Role;
import com.yashwanth.pms.user.domain.User;
import com.yashwanth.pms.user.service.UserService;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class IssueServiceImpl implements IssueService {

    private final IssueRepository issueRepository;
    private final ProjectService projectService;
    private final TaskService taskService;
    private final UserService userService;
    private final ApplicationEventPublisher publisher;

    public IssueServiceImpl(IssueRepository issueRepository,
                            ProjectService projectService,
                            TaskService taskService,
                            UserService userService,
                            ApplicationEventPublisher publisher) {
        this.issueRepository = issueRepository;
        this.projectService = projectService;
        this.taskService = taskService;
        this.userService = userService;
        this.publisher = publisher;
    }

    @Override
    @Transactional
    public Issue createIssue(UUID projectId, UUID taskId, String title, String description,
                             String type, String priority, UUID reporterId, UUID assigneeId) {

        User reporter = userService.getById(reporterId);
        Project project = projectService.getById(projectId);

        // ✅ Validate reporter is a project member
        if (!project.isMember(reporter)) {
            throw new AccessDeniedException("You must be a project member to create an issue");
        }

        // ✅ Validate task belongs to project if provided
        Task task = null;
        if (taskId != null) {
            task = taskService.getById(taskId);
            if (!task.getProject().getId().equals(projectId)) {
                throw new BusinessException("Task does not belong to this project");
            }
        }

        // ✅ Handle assignee - if assigneeId is provided, fetch the user, otherwise null
        User assignee = null;
        if (assigneeId != null) {
            assignee = userService.getById(assigneeId);

            // ✅ Prevent assigning to ADMIN
            if (assignee.getRole() == Role.ADMIN) {
                throw new BusinessException("Cannot assign issue to ADMIN user");
            }

            // ✅ Assignee must be a project member
            if (!project.isMember(assignee)) {
                throw new BusinessException("Assignee must be a member of the project");
            }
        }

        Issue issue = new Issue(
                title,
                description,
                IssueType.valueOf(type),
                IssuePriority.valueOf(priority),
                project,
                task,
                reporter,
                assignee  // ✅ Can be null
        );

        Issue savedIssue = issueRepository.save(issue);

        // ✅ If assignee was provided, publish assignment event
        if (assignee != null) {
            publisher.publishEvent(new IssueAssignedEvent(
                    assignee.getId(),
                    savedIssue.getId(),
                    savedIssue.getProject().getId(),
                    savedIssue.getTitle()
            ));
        }

        return savedIssue;
    }

    @Override
    @Transactional
    public void assignIssue(UUID issueId, UUID assigneeId, UUID currentUserId) {
        User currentUser = userService.getById(currentUserId);

        // ✅ Only PROJECT_LEADER can assign issues
        Issue issue = getById(issueId);
        Project project = issue.getProject();

        if (!project.isLeader(currentUser)) {
            throw new AccessDeniedException("Only Project Leader can assign issues");
        }

        User assignee = userService.getById(assigneeId);

        // ✅ Prevent assigning to ADMIN
        if (assignee.getRole() == Role.ADMIN) {
            throw new BusinessException("Cannot assign issue to ADMIN user");
        }

        // ✅ Assignee must be a project member
        if (!project.isMember(assignee)) {
            throw new BusinessException("Assignee must be a member of the project");
        }

        issue.assignTo(assignee);
        issueRepository.save(issue);

        publisher.publishEvent(new IssueAssignedEvent(
                assigneeId,
                issueId,
                issue.getProject().getId(),
                issue.getTitle()
        ));
    }

    @Override
    @Transactional
    public void changeIssueStatus(UUID issueId, String newStatus, UUID currentUserId) {
        User currentUser = userService.getById(currentUserId);
        Issue issue = getById(issueId);

        // ✅ Who can change status:
        // 1. ADMIN
        // 2. PROJECT_LEADER
        // 3. ASSIGNEE (only if they are the assignee)
        boolean isAdmin = currentUser.getRole() == Role.ADMIN;
        boolean isProjectLeader = issue.getProject().isLeader(currentUser);
        boolean isAssignee = issue.getAssignee() != null &&
                issue.getAssignee().getId().equals(currentUserId);

        if (!isAdmin && !isProjectLeader && !isAssignee) {
            throw new AccessDeniedException(
                    "Only Admin, Project Leader, or the Assignee can change issue status"
            );
        }

        IssueStatus currentStatus = issue.getStatus();
        IssueStatus targetStatus = IssueStatus.valueOf(newStatus);

        issue.changeStatus(targetStatus);
        issueRepository.save(issue);

        publisher.publishEvent(new IssueStatusChangedEvent(
                issueId,
                issue.getReporter().getId(),
                currentStatus,
                targetStatus,
                issue.getAssignee() != null ? issue.getAssignee().getName() : "Unassigned",
                issue.getTitle()
        ));
    }

    @Override
    public List<Issue> getIssuesByProject(UUID projectId) {
        Project project = projectService.getById(projectId);
        return issueRepository.findByProject(project);
    }

    @Override
    public Issue getById(UUID issueId) {
        return issueRepository.findById(issueId)
                .orElseThrow(() -> new ResourceNotFoundException("Issue does not exist"));
    }
}