package com.yashwanth.pms.task.dto;

import jakarta.validation.constraints.NotBlank;

import java.util.UUID;

public class CreateTaskRequest {
    @NotBlank
    private String title;

    private String description;

    @NotBlank
    private String priority;

    private UUID assigneeId;  // ✅ Already exists

    // Getters and setters
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
    public UUID getAssigneeId() { return assigneeId; }
    public void setAssigneeId(UUID assigneeId) { this.assigneeId = assigneeId; }
}