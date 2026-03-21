package com.yashwanth.pms.events;

import java.util.List;
import java.util.UUID;

public class CommentAddedEvent {

    private final List<UUID> userIds;
    private final String message;

    public CommentAddedEvent(List<UUID> userIds, String message) {
        this.userIds = userIds;
        this.message = message;
    }

    public List<UUID> getUserIds() {
        return userIds;
    }

    public String getMessage() {
        return message;
    }
}
