package com.yashwanth.pms.notification.domain;

import jakarta.persistence.*;
import org.aspectj.weaver.ast.Not;
import org.springframework.cglib.core.Local;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
public class Notification {

    @Id
    @GeneratedValue
    private UUID id;

    private UUID userId;

    private String message;

    @Enumerated(EnumType.STRING)
    private NotificationType type;

    private boolean read;

    private LocalDateTime createdAt;

    public Notification() {}

    public Notification(
            UUID userId,
            String message,
            NotificationType type
    ) {
        this.userId = userId;
        this.message = message;
        this.type = type;
        this.read = false;
        this.createdAt = LocalDateTime.now();
    }

    public UUID getId() {
        return id;
    }

    public UUID getUserId() {
        return userId;
    }

    public String getMessage() {
        return message;
    }

    public NotificationType getType() {
        return type;
    }

    public boolean isRead() {
        return read;
    }

    public void markAsRead() {
        this.read = true;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

}
