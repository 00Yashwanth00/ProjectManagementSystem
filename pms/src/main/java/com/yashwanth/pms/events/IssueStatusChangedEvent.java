package com.yashwanth.pms.events;

import com.yashwanth.pms.issue.domain.IssueStatus;

import java.util.UUID;

public class IssueStatusChangedEvent {

    private final UUID issueId;
    private final UUID userId;
    private final IssueStatus from;
    private final IssueStatus to;
    private final String changedBy;
    private final String title;

    public IssueStatusChangedEvent(UUID issueId, UUID userId, IssueStatus from, IssueStatus to, String changedBy, String title) {
        this.issueId = issueId;
        this.userId = userId;
        this.from = from;
        this.to = to;
        this.changedBy = changedBy;
        this.title = title;
    }

    public UUID getIssueId() {
        return issueId;
    }

    public UUID getUserId() {
        return userId;
    }

    public IssueStatus getFrom() {
        return from;
    }

    public IssueStatus getTo() {
        return to;
    }

    public String getChangedBy() {
        return changedBy;
    }

    public String getTitle() {
        return title;
    }
}
