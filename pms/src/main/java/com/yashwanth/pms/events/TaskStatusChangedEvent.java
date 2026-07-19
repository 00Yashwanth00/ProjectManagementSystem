package com.yashwanth.pms.events;

import com.yashwanth.pms.task.domain.TaskStatus;

import java.util.UUID;

public class TaskStatusChangedEvent {

    private final UUID taskId;
    private final UUID assigneeId;      // ✅ Changed from userId to assigneeId
    private final UUID creatorId;       // ✅ Added creatorId
    private final TaskStatus oldStatus; // ✅ Changed from from
    private final TaskStatus newStatus; // ✅ Changed from to
    private final String changedBy;
    private final String taskTitle;     // ✅ Changed from title

    // Original constructor (for backward compatibility)
    public TaskStatusChangedEvent(UUID taskId, UUID userId, TaskStatus from, TaskStatus to, String changedBy, String title) {
        this.taskId = taskId;
        this.assigneeId = userId;
        this.creatorId = null;
        this.oldStatus = from;
        this.newStatus = to;
        this.changedBy = changedBy;
        this.taskTitle = title;
    }

    // ✅ New constructor with all fields
    public TaskStatusChangedEvent(UUID taskId, UUID assigneeId, UUID creatorId,
                                  TaskStatus oldStatus, TaskStatus newStatus,
                                  String changedBy, String taskTitle) {
        this.taskId = taskId;
        this.assigneeId = assigneeId;
        this.creatorId = creatorId;
        this.oldStatus = oldStatus;
        this.newStatus = newStatus;
        this.changedBy = changedBy;
        this.taskTitle = taskTitle;
    }

    // Getters
    public UUID getTaskId() { return taskId; }
    public UUID getAssigneeId() { return assigneeId; }
    public UUID getCreatorId() { return creatorId; }
    public TaskStatus getOldStatus() { return oldStatus; }
    public TaskStatus getNewStatus() { return newStatus; }
    public String getChangedBy() { return changedBy; }
    public String getTaskTitle() { return taskTitle; }

    // ✅ Legacy getters for backward compatibility
    @Deprecated
    public UUID getUserId() { return assigneeId; }
    @Deprecated
    public TaskStatus getFrom() { return oldStatus; }
    @Deprecated
    public TaskStatus getTo() { return newStatus; }
    @Deprecated
    public String getTitle() { return taskTitle; }
}