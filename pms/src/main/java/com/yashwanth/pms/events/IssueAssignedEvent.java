package com.yashwanth.pms.events;

import java.util.UUID;

public class IssueAssignedEvent {

    private final UUID assigneeId;
    private final UUID issueId;
    private final UUID projectId;
    private final String issueTitle;

    public IssueAssignedEvent(UUID assigneeId, UUID issueId, UUID projectId, String issueTitle) {
        this.assigneeId = assigneeId;
        this.issueId = issueId;
        this.projectId = projectId;
        this.issueTitle = issueTitle;
    }

    public UUID getAssigneeId() {
        return assigneeId;
    }

    public UUID getIssueId() {
        return issueId;
    }

    public UUID getProjectId() {
        return projectId;
    }

    public String getIssueTitle() {
        return issueTitle;
    }
}
