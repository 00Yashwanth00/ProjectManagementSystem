package com.yashwanth.pms.issue.domain;

import com.yashwanth.pms.project.domain.Project;
import com.yashwanth.pms.task.domain.Task;
import com.yashwanth.pms.user.domain.User;
import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Table(name = "issues")
public class Issue {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String title;

    @Column(length = 1500)
    private String description;

    @Enumerated(EnumType.STRING)
    private IssueType type;

    @Enumerated(EnumType.STRING)
    private IssuePriority priority;

    @Enumerated(EnumType.STRING)
    private IssueStatus status;

    @ManyToOne(optional = false)
    private Project project;

    @ManyToOne
    private Task task;

    @ManyToOne(optional = false)
    private User reporter;

    @ManyToOne
    private User assignee;

    protected Issue () {
        //jpa
    }

    public Issue(String title,
                 String description,
                 IssueType type,
                 IssuePriority priority,
                 Project project,
                 Task task,
                 User reporter) {

        this.title = title;
        this.description = description;
        this.type = type;
        this.priority = priority;
        this.project = project;
        this.task = task;
        this.reporter = reporter;
        this.status = IssueStatus.OPEN;
    }

    public void assignTo(User user) {
        this.assignee = user;
    }

    public void changeStatus(IssueStatus newStatus) {
        if(!this.status.canTransitionTo(newStatus)) {
            throw new IllegalStateException("Invalid issue status transition");
        }
        this.status = newStatus;
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

    public IssueType getType() {
        return type;
    }

    public IssuePriority getPriority() {
        return priority;
    }

    public IssueStatus getStatus() {
        return status;
    }

    public Project getProject() {
        return project;
    }

    public Task getTask() {
        return task;
    }

    public User getReporter() {
        return reporter;
    }

    public User getAssignee() {
        return assignee;
    }
}
