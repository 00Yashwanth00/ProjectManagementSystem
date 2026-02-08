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
import com.yashwanth.pms.task.domain.Task;
import com.yashwanth.pms.task.service.TaskService;
import com.yashwanth.pms.user.domain.Role;
import com.yashwanth.pms.user.domain.User;
import com.yashwanth.pms.user.service.UserService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class IssueServiceImpl implements IssueService {

    private final IssueRepository issueRepository;
    private final ProjectService projectService;
    private final TaskService taskService;
    private final UserService userService;

    public IssueServiceImpl(IssueRepository issueRepository, ProjectService projectService, TaskService taskService, UserService userService) {
        this.issueRepository = issueRepository;
        this.projectService = projectService;
        this.taskService = taskService;
        this.userService = userService;
    }

    @Override
    public Issue createIssue(UUID projectId, UUID taskId, String title, String description, String type, String priority, UUID reporterId) {

        User reporter = userService.getById(reporterId);
        Project project = projectService.getById(projectId);
        Task task = taskService.getById(taskId);

        Issue issue = new Issue(title, description, IssueType.valueOf(type), IssuePriority.valueOf(priority), project, task, reporter);

        return issueRepository.save(issue);
    }

    @Override
    public void assignIssue(UUID issueId, UUID assigneeId, UUID currentUserId) {
        User currentUser = userService.getById(currentUserId);

        if(currentUser.getRole() != Role.PROJECT_LEADER) {
            throw new AccessDeniedException("Not allowed to assign issues");
        }

        Issue issue = getById(issueId);

        User assignee = userService.getById(assigneeId);

        issue.assignTo(assignee);
        issueRepository.save(issue);
    }

    @Override
    public void changeIssueStatus(UUID issueId, String newStatus, UUID currentUserId) {

        User currentUser = userService.getById(currentUserId);
        Issue issue = getById(issueId);

        if (currentUser.getRole() == Role.TEAM_MEMBER) {
            if (issue.getAssignee() == null ||
                    !issue.getAssignee().getId().equals(currentUserId)) {

                throw new AccessDeniedException(
                        "Not allowed to change issue status");
            }
        }

        issue.changeStatus(IssueStatus.valueOf(newStatus));
        issueRepository.save(issue);
    }

    @Override
    public List<Issue> getIssuesByProject(UUID projectId) {
        Project project = projectService.getById(projectId);

        return issueRepository.findByProject(project);
    }

    @Override
    public Issue getById(UUID issueId) {
        return issueRepository.findById(issueId).orElseThrow(() -> new ResourceNotFoundException("Issue does not exist"));
    }
}
