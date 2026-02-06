package com.yashwanth.pms.task.repository;

import com.yashwanth.pms.project.domain.Project;
import com.yashwanth.pms.task.domain.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface TaskRepository extends JpaRepository<Task, UUID> {

    List<Task> findByProject(Project project);

}
