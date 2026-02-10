package com.yashwanth.pms.comment.domain;

import com.yashwanth.pms.issue.domain.Issue;
import com.yashwanth.pms.task.domain.Task;
import com.yashwanth.pms.user.domain.User;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "comments")
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 1500)
    private String content;

    @ManyToOne(optional = false)
    private User author;

    @ManyToOne
    private Task task;

    @ManyToOne
    private Issue issue;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    protected Comment() {
        // for JPA
    }

    private Comment(String content,
                    User author,
                    Task task,
                    Issue issue) {

        this.content = content;
        this.author = author;
        this.task = task;
        this.issue = issue;
        this.createdAt = LocalDateTime.now();
    }

    /* =========================
       Factory methods
       ========================= */

    public static Comment forTask(
            String content,
            User author,
            Task task
    ) {
        return new Comment(content, author, task, null);
    }

    public static Comment forIssue(
            String content,
            User author,
            Issue issue
    ) {
        return new Comment(content, author, null, issue);
    }

    /* =========================
       Getters
       ========================= */

    public UUID getId() {
        return id;
    }

    public String getContent() {
        return content;
    }

    public User getAuthor() {
        return author;
    }

    public Task getTask() {
        return task;
    }

    public Issue getIssue() {
        return issue;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
