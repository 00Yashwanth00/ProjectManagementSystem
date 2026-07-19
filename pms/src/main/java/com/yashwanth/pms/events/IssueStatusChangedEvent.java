package com.yashwanth.pms.events;

import com.yashwanth.pms.issue.domain.IssueStatus;

import java.util.UUID;

public class IssueStatusChangedEvent {

    private final UUID issueId;
    private final UUID assigneeId;
    private final UUID reporterId;
    private final IssueStatus oldStatus;
    private final IssueStatus newStatus;
    private final String changedBy;
    private final String issueTitle;

    // Original constructor (for backward compatibility)
    public IssueStatusChangedEvent(UUID issueId, UUID userId, IssueStatus from, IssueStatus to, String changedBy, String title) {
        this.issueId = issueId;
        this.assigneeId = userId;
        this.reporterId = null;
        this.oldStatus = from;
        this.newStatus = to;
        this.changedBy = changedBy;
        this.issueTitle = title;
    }

    // ✅ New constructor with all fields
    public IssueStatusChangedEvent(UUID issueId, UUID assigneeId, UUID reporterId,
                                   IssueStatus oldStatus, IssueStatus newStatus,
                                   String changedBy, String issueTitle) {
        this.issueId = issueId;
        this.assigneeId = assigneeId;
        this.reporterId = reporterId;
        this.oldStatus = oldStatus;
        this.newStatus = newStatus;
        this.changedBy = changedBy;
        this.issueTitle = issueTitle;
    }

    // Getters
    public UUID getIssueId() { return issueId; }
    public UUID getAssigneeId() { return assigneeId; }
    public UUID getReporterId() { return reporterId; }
    public IssueStatus getOldStatus() { return oldStatus; }
    public IssueStatus getNewStatus() { return newStatus; }
    public String getChangedBy() { return changedBy; }
    public String getIssueTitle() { return issueTitle; }

    // ✅ Legacy getters for backward compatibility
    @Deprecated
    public UUID getUserId() { return assigneeId; }
    @Deprecated
    public IssueStatus getFrom() { return oldStatus; }
    @Deprecated
    public IssueStatus getTo() { return newStatus; }
    @Deprecated
    public String getTitle() { return issueTitle; }
}