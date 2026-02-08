package com.yashwanth.pms.issue.domain;

import java.util.Set;

public enum IssueStatus {
    OPEN, IN_PROGRESS, RESOLVED, CLOSED;

    public boolean canTransitionTo(IssueStatus target) {
        return switch (this) {
            case OPEN -> Set.of(IN_PROGRESS).contains(target);
            case IN_PROGRESS -> Set.of(RESOLVED).contains(target);
            case RESOLVED -> Set.of(CLOSED).contains(target);
            case CLOSED -> false;
        };

    }
}
