package com.yashwanth.pms.task.service;

import com.yashwanth.pms.task.domain.Task;

import java.util.List;
import java.util.UUID;

public interface TaskService {

    Task createTask(UUID projectId, String title, String description, String priority, UUID creatorId);

    void assignTask(UUID taskId, UUID assigneeId, UUID currentUserId);

    List<Task> getTasksByProject(UUID projectId);

}
