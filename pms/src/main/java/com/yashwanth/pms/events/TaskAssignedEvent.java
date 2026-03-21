package com.yashwanth.pms.events;

import java.util.UUID;

public class TaskAssignedEvent {

    private final UUID taskId;
    private final UUID userId;
    private final String taskTitle;

    public TaskAssignedEvent(UUID taskId, UUID userId, String taskTitle) {
        this.taskId = taskId;
        this.userId = userId;
        this.taskTitle = taskTitle;
    }

    public UUID getTaskId() {
        return taskId;
    }

    public UUID getUserId() {
        return userId;
    }

    public String getTaskTitle() {
        return taskTitle;
    }
}
