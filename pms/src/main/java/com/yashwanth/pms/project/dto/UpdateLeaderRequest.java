package com.yashwanth.pms.project.dto;

import java.util.UUID;

public class UpdateLeaderRequest {
    private UUID leaderId;

    public UpdateLeaderRequest() {}

    public UpdateLeaderRequest(UUID leaderId) {
        this.leaderId = leaderId;
    }

    public UUID getLeaderId() {
        return leaderId;
    }

    public void setLeaderId(UUID leaderId) {
        this.leaderId = leaderId;
    }
}