package com.yashwanth.pms.issue.dto;

import jakarta.validation.constraints.NotBlank;

import java.util.UUID;

public class CreateIssueRequest {
    @NotBlank
    private String title;

    private String description;

    @NotBlank
    private String type;

    @NotBlank
    private String priority;

    private UUID taskId;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public UUID getTaskId() {
        return taskId;
    }

    public void setTaskId(UUID taskId) {
        this.taskId = taskId;
    }
}
