package com.yashwanth.pms.project.service;

import com.yashwanth.pms.common.exception.AccessDeniedException;
import com.yashwanth.pms.common.exception.BusinessException;
import com.yashwanth.pms.common.exception.ResourceNotFoundException;
import com.yashwanth.pms.project.domain.Project;
import com.yashwanth.pms.project.domain.ProjectStatus;
import com.yashwanth.pms.project.repository.ProjectRepository;
import com.yashwanth.pms.user.domain.Role;
import com.yashwanth.pms.user.domain.User;
import com.yashwanth.pms.user.service.UserService;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;
    private final UserService userService;

    public ProjectServiceImpl(ProjectRepository projectRepository,
                              UserService userService) {
        this.projectRepository = projectRepository;
        this.userService = userService;
    }

    @Override
    public Project createProject(String name, UUID leaderId, UUID currentUserId) {

        User admin = userService.getById(currentUserId);

        if (admin.getRole() != Role.ADMIN) {
            throw new AccessDeniedException("Only admin can create projects");
        }

        User leader = userService.getById(leaderId);

        if (leader.getRole() != Role.PROJECT_LEADER) {
            throw new BusinessException("Assigned user is not a project leader");
        }

        Project project = new Project(name, leader);
        return projectRepository.save(project);
    }


    @Override
    public void addMember(UUID projectId, UUID userId, UUID currentUserId) {


        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        if(project.getStatus() != ProjectStatus.ACTIVE) {
            throw new BusinessException("Project is not active");
        }

        User currentUser = userService.getById(currentUserId);

        authorize(project, currentUser);

        User userToAdd = userService.getById(userId);

        if (project.getMembers().contains(userToAdd)) {
            throw new BusinessException("User already a member");
        }

        project.getMembers().add(userToAdd);
        projectRepository.save(project);
    }

    @Override
    public void removeMember(UUID projectId, UUID userId, UUID currentUserId) {

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        if(project.getStatus() != ProjectStatus.ACTIVE) {
            throw new BusinessException("Project is not active");
        }

        User currentUser = userService.getById(currentUserId);

        authorize(project, currentUser);

        User userToRemove = userService.getById(userId);

        if (userToRemove.equals(project.getLeader())) {
            throw new BusinessException("Cannot remove project leader");
        }

        project.getMembers().remove(userToRemove);
        projectRepository.save(project);
    }

    @Override
    public Project getById(UUID projectId) {
        Project project = projectRepository.findById(projectId).orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        return project;
    }

    private void authorize(Project project, User currentUser) {
        if (currentUser.getRole() != Role.ADMIN &&
                !currentUser.equals(project.getLeader())) {
            throw new AccessDeniedException("Not authorized");
        }
    }

}
