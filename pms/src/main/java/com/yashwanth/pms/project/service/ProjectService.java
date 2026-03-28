package com.yashwanth.pms.project.service;

import com.yashwanth.pms.project.domain.Project;
import com.yashwanth.pms.user.domain.User;

import java.util.List;
import java.util.UUID;


public interface ProjectService {

    Project createProject(String name, UUID leaderId, UUID currentUserId);

    void addMember(UUID projectId, UUID userId, UUID currentUserId);

    void removeMember(UUID projectId, UUID userId, UUID currentUserId);

    Project getById(UUID projectId);

    List<Project> getAllProjects();
}
