package com.yashwanth.pms.project.dto;

import com.yashwanth.pms.project.domain.Project;

import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

public class ProjectResponse {

    private UUID id;
    private String name;
    private UUID leaderId;
    private Set<UUID> memberIds;

    public static ProjectResponse from(Project project) {
        ProjectResponse response = new ProjectResponse();
        response.id = project.getId();
        response.name = project.getName();
        response.leaderId = project.getLeader().getId();
        response.memberIds = project.getMembers()
                .stream()
                .map(u -> u.getId())
                .collect(Collectors.toSet());
        return response;
    }

    public UUID getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public UUID getLeaderId() {
        return leaderId;
    }

    public Set<UUID> getMemberIds() {
        return memberIds;
    }

}
