package com.yashwanth.pms.issue.service;

import com.yashwanth.pms.issue.domain.Issue;

import java.util.List;
import java.util.UUID;

public interface IssueService {

    Issue createIssue(UUID projectId, UUID taskId, String title, String description, String type, String priority, UUID reporterId);

    void assignIssue(UUID issueId, UUID assigneeId, UUID currentUserId);

    void changeIssueStatus(
            UUID issueId,
            String newStatus,
            UUID currentUserId
    );

    List<Issue> getIssuesByProject(UUID projectId);

    Issue getById(UUID issueId);
}
