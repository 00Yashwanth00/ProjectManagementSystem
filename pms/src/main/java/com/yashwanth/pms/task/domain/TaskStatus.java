package com.yashwanth.pms.task.domain;

import java.util.Set;

public enum TaskStatus {
    TODO,
    IN_PROGRESS,
    DONE;

    public boolean canTransitionTo(TaskStatus target) {
        return switch (this) {
            case TODO -> Set.of(IN_PROGRESS).contains(target);
            case IN_PROGRESS -> Set.of(DONE).contains(target);
            case DONE -> false;
        };
    }
}
