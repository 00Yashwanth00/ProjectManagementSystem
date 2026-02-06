package com.yashwanth.pms.task.dto;

import com.yashwanth.pms.task.domain.Task;

import java.util.UUID;

public class TaskResponse {
    private UUID id;
    private String title;
    private String status;
    private String priority;
    private UUID assigneeId;

    public static TaskResponse from(Task task) {
        TaskResponse r = new TaskResponse();
        r.id = task.getId();
        r.title = task.getTitle();
        r.status = task.getStatus().name();
        r.priority = task.getPriority().name();
        r.assigneeId = task.getAssignee() != null
                ? task.getAssignee().getId()
                : null;
        return r;
    }

    public UUID getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getStatus() {
        return status;
    }

    public String getPriority() {
        return priority;
    }

    public UUID getAssigneeId() {
        return assigneeId;
    }
}
