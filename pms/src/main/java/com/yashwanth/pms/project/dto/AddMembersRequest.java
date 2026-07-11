package com.yashwanth.pms.project.dto;

import jakarta.validation.constraints.NotEmpty;
import java.util.List;
import java.util.UUID;

public class AddMembersRequest {
    @NotEmpty(message = "User IDs cannot be empty")
    private List<UUID> userIds;

    public AddMembersRequest() {}

    public AddMembersRequest(List<UUID> userIds) {
        this.userIds = userIds;
    }

    public List<UUID> getUserIds() {
        return userIds;
    }

    public void setUserIds(List<UUID> userIds) {
        this.userIds = userIds;
    }
}