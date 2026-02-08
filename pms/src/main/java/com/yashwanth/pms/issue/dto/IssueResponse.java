package com.yashwanth.pms.issue.dto;

import com.yashwanth.pms.issue.domain.Issue;

import java.util.UUID;

public class IssueResponse {
    private UUID id;
    private String title;
    private String status;
    private UUID assigneeId;

    public static IssueResponse from(Issue issue) {
        IssueResponse r = new IssueResponse();
        r.id = issue.getId();
        r.title = issue.getTitle();
        r.status = issue.getStatus().name();
        r.assigneeId = issue.getAssignee() != null
                ? issue.getAssignee().getId()
                : null;
        return r;
    }

    public UUID getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getStatus() {
        return status;
    }

    public UUID getAssigneeId() {
        return assigneeId;
    }
}
