package com.yashwanth.pms.task.domain;

import com.yashwanth.pms.project.domain.Project;
import com.yashwanth.pms.user.domain.User;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "tasks")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String title;

    @Column(length = 1000)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TaskStatus status;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TaskPriority priority;

    @ManyToOne
    private Project project;

    @ManyToOne
    private User assignee;

    @ManyToOne(optional = false)
    private User createdBy;

    private LocalDateTime createdAt;

    protected  Task() {
        //JPA
    }

    public Task(String title,
                String description,
                TaskPriority priority,
                Project project,
                User createdBy) {

        this.title = title;
        this.description = description;
        this.priority = priority;
        this.project = project;
        this.createdBy = createdBy;
        this.status = TaskStatus.TODO;
        this.createdAt = LocalDateTime.now();
    }

    public UUID getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public TaskStatus getStatus() {
        return status;
    }

    public TaskPriority getPriority() {
        return priority;
    }

    public Project getProject() {
        return project;
    }

    public User getAssignee() {
        return assignee;
    }

    public User getCreatedBy() {
        return createdBy;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void assignTo(User assignee) {
        this.assignee = assignee;
    }
}
