package com.yashwanth.pms.task.repository;

import com.yashwanth.pms.project.domain.Project;
import com.yashwanth.pms.task.domain.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface TaskRepository extends JpaRepository<Task, UUID> {

    List<Task> findByProject(Project project);

    List<Task> findByProjectIdAndAssigneeId(UUID projectId, UUID assigneeId);

    // ✅ NEW: Count tasks assigned to a user in a project
    @Query("SELECT COUNT(t) FROM Task t WHERE t.project.id = :projectId AND t.assignee.id = :assigneeId AND t.status != 'DONE'")
    long countByProjectIdAndAssigneeId(@Param("projectId") UUID projectId, @Param("assigneeId") UUID assigneeId);

    // ✅ NEW: Count tasks assigned to a user across all projects
    @Query("SELECT COUNT(t) FROM Task t WHERE t.assignee.id = :assigneeId AND t.status != 'DONE'")
    long countByAssigneeId(@Param("assigneeId") UUID assigneeId);
}