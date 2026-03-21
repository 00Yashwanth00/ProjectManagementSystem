package com.yashwanth.pms.events;

import com.yashwanth.pms.task.domain.TaskStatus;

import java.util.UUID;

public class TaskStatusChangedEvent {

    private final UUID taskId;
    private final UUID userId;
    private final TaskStatus from;
    private final TaskStatus to;
    private final String changedBy;
    private final String title;

    public TaskStatusChangedEvent(UUID taskId, UUID userId, TaskStatus from, TaskStatus to, String changedBy, String title) {
        this.taskId = taskId;
        this.userId = userId;
        this.from = from;
        this.to = to;
        this.changedBy = changedBy;
        this.title = title;
    }

    public UUID getTaskId() {
        return taskId;
    }

    public UUID getUserId() {
        return userId;
    }

    public TaskStatus getFrom() {
        return from;
    }

    public TaskStatus getTo() {
        return to;
    }

    public String getChangedBy() {
        return changedBy;
    }

    public String getTitle() {
        return title;
    }
}
