package com.yashwanth.pms.project.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public class CreateProjectRequest {

    @NotBlank
    private String name;

    @NotNull
    private UUID leaderId;

    public String getName() {
        return name;
    }

    public UUID getLeaderId() {
        return leaderId;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setLeaderId(UUID leaderId) {
        this.leaderId = leaderId;
    }
}
