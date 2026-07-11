package com.yashwanth.pms.project.dto;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public class PromoteRequest {
    @NotNull(message = "User ID is required")
    private UUID userId;

    public PromoteRequest() {}

    public PromoteRequest(UUID userId) {
        this.userId = userId;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }
}