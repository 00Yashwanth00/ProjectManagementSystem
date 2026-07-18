package com.yashwanth.pms.task.domain;

import java.util.Set;

public enum TaskStatus {
    TODO,
    IN_PROGRESS,
    DONE;

    public boolean canTransitionTo(TaskStatus target) {
        // ✅ Prevent transition from DONE to any other state
        if (this == DONE) {
            return false;
        }

        return switch (this) {
            case TODO -> Set.of(IN_PROGRESS, DONE).contains(target);  // ✅ Can skip to DONE
            case IN_PROGRESS -> Set.of(DONE).contains(target);
            case DONE -> false;
        };
    }
}