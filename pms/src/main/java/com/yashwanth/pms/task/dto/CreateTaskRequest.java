package com.yashwanth.pms.task.dto;

import jakarta.validation.constraints.NotBlank;

public class CreateTaskRequest {
    @NotBlank
    private String title;

    private String description;

    @NotBlank
    private String priority;

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

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }
}
