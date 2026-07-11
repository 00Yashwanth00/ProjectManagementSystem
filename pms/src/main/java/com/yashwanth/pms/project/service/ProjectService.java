package com.yashwanth.pms.project.service;

import com.yashwanth.pms.project.domain.Project;

import java.util.List;
import java.util.UUID;

public interface ProjectService {

    Project createProject(String name, UUID leaderId, UUID currentUserId);

    void addMembers(UUID projectId, List<UUID> userIds, UUID currentUserId);

    void removeMember(UUID projectId, UUID userId, UUID currentUserId);

    Project getById(UUID projectId);

    List<Project> getAllProjects();

    List<Project> getProjectsByMemberId(UUID userId);

    List<Project> getProjectsLeadByUser(UUID userId);

    Project updateProjectLeader(UUID projectId, UUID leaderId);

    void promoteToLeader(UUID projectId, UUID userId, UUID currentUserId);

    void demoteFromLeader(UUID projectId, UUID userId, UUID currentUserId);

    // ✅ NEW: Validate project access
    void validateProjectAccess(UUID projectId, UUID userId);
}