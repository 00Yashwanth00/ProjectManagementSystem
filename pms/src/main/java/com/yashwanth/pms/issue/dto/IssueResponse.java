package com.yashwanth.pms.issue.dto;

import com.yashwanth.pms.issue.domain.Issue;
import com.yashwanth.pms.user.dto.UserResponse;

import java.util.UUID;

public class IssueResponse {
    private UUID id;
    private String title;
    private String description;
    private String type;
    private String priority;
    private String status;
    private UserResponse assignee;      // ✅ Full user object
    private UserResponse reporter;      // ✅ Full user object
    private UUID taskId;
    private UUID projectId;

    public static IssueResponse from(Issue issue) {
        IssueResponse r = new IssueResponse();
        r.id = issue.getId();
        r.title = issue.getTitle();
        r.description = issue.getDescription();
        r.type = issue.getType() != null ? issue.getType().name() : null;
        r.priority = issue.getPriority() != null ? issue.getPriority().name() : null;
        r.status = issue.getStatus() != null ? issue.getStatus().name() : null;

        // ✅ Full assignee object (not just ID)
        r.assignee = issue.getAssignee() != null ? UserResponse.from(issue.getAssignee()) : null;

        // ✅ Full reporter object
        r.reporter = issue.getReporter() != null ? UserResponse.from(issue.getReporter()) : null;

        r.taskId = issue.getTask() != null ? issue.getTask().getId() : null;
        r.projectId = issue.getProject() != null ? issue.getProject().getId() : null;
        return r;
    }

    // Getters and setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public UserResponse getAssignee() { return assignee; }
    public void setAssignee(UserResponse assignee) { this.assignee = assignee; }
    public UserResponse getReporter() { return reporter; }
    public void setReporter(UserResponse reporter) { this.reporter = reporter; }
    public UUID getTaskId() { return taskId; }
    public void setTaskId(UUID taskId) { this.taskId = taskId; }
    public UUID getProjectId() { return projectId; }
    public void setProjectId(UUID projectId) { this.projectId = projectId; }
}