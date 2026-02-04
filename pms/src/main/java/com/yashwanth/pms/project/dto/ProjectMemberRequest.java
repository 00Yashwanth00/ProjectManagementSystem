package com.yashwanth.pms.project.dto;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public class ProjectMemberRequest {

    @NotNull
    private UUID userId;

    public UUID getUserId() {
        return userId;
    }
}
