package com.yashwanth.pms.events;

import java.util.UUID;

public class TaskAssignedEvent {

    private final UUID taskId;
    private final UUID assigneeId;
    private final String taskTitle;

    public TaskAssignedEvent(UUID taskId, UUID assigneeId, String taskTitle) {
        this.taskId = taskId;
        this.assigneeId = assigneeId;
        this.taskTitle = taskTitle;
    }

    public UUID getTaskId() { return taskId; }
    public UUID getAssigneeId() { return assigneeId; }
    public String getTaskTitle() { return taskTitle; }
}