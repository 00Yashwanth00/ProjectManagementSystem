package com.yashwanth.pms.task.dto;

import com.yashwanth.pms.task.domain.Task;
import com.yashwanth.pms.user.dto.UserResponse;

import java.util.UUID;

public class TaskResponse {
    private UUID id;
    private String title;
    private String description;
    private String status;
    private String priority;
    private UserResponse assignee;  // ✅ Full user object
    private UserResponse createdBy;  // ✅ Full user object
    private String createdAt;
    private UUID projectId;

    public static TaskResponse from(Task task) {
        TaskResponse r = new TaskResponse();
        r.id = task.getId();
        r.title = task.getTitle();
        r.description = task.getDescription();
        r.status = task.getStatus().name();
        r.priority = task.getPriority().name();
        r.assignee = task.getAssignee() != null ? UserResponse.from(task.getAssignee()) : null;
        r.createdBy = UserResponse.from(task.getCreatedBy());
        r.createdAt = task.getCreatedAt() != null ? task.getCreatedAt().toString() : null;
        r.projectId = task.getProject() != null ? task.getProject().getId() : null;
        return r;
    }

    // Getters and setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
    public UserResponse getAssignee() { return assignee; }
    public void setAssignee(UserResponse assignee) { this.assignee = assignee; }
    public UserResponse getCreatedBy() { return createdBy; }
    public void setCreatedBy(UserResponse createdBy) { this.createdBy = createdBy; }
    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
    public UUID getProjectId() { return projectId; }
    public void setProjectId(UUID projectId) { this.projectId = projectId; }
}