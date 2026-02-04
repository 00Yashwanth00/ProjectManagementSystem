package com.yashwanth.pms.project.service;

import com.yashwanth.pms.project.domain.Project;
import com.yashwanth.pms.user.domain.User;

import java.util.UUID;

public interface ProjectService {

    Project createProject(String name, UUID leaderId, User currentUser);

    void addMember(UUID projectId, UUID userId, User currentUser);

    void removeMember(UUID projectId, UUID userId, User currentUser);
}
