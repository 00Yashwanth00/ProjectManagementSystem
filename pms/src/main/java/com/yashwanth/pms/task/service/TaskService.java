package com.yashwanth.pms.task.service;

import com.yashwanth.pms.task.domain.Task;

import java.util.List;
import java.util.UUID;

public interface TaskService {

    // ✅ Added assigneeId parameter
    Task createTask(UUID projectId, String title, String description, String priority, UUID assigneeId, UUID creatorId);

    void assignTask(UUID taskId, UUID assigneeId, UUID currentUserId);

    List<Task> getTasksByProject(UUID projectId);

    void changeTaskStatus(UUID taskId, String newStatus, UUID currentUserId);

    Task getById(UUID taskId);

    List<Task> getTasksByMember(UUID projectId, UUID userId);

}