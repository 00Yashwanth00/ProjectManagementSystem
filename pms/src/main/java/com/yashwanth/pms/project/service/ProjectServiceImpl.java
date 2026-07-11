package com.yashwanth.pms.project.service;

import com.yashwanth.pms.common.exception.AccessDeniedException;
import com.yashwanth.pms.common.exception.BusinessException;
import com.yashwanth.pms.common.exception.ResourceNotFoundException;
import com.yashwanth.pms.events.ProjectMemberAddedEvent;
import com.yashwanth.pms.project.domain.Project;
import com.yashwanth.pms.project.domain.ProjectStatus;
import com.yashwanth.pms.project.repository.ProjectRepository;
import com.yashwanth.pms.user.domain.Role;
import com.yashwanth.pms.user.domain.User;
import com.yashwanth.pms.user.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class ProjectServiceImpl implements ProjectService {

    private static final Logger logger = LoggerFactory.getLogger(ProjectServiceImpl.class);
    private static final int MAX_PROJECTS_LEAD = 3;

    private final ProjectRepository projectRepository;
    private final UserService userService;
    private final ApplicationEventPublisher publisher;

    public ProjectServiceImpl(ProjectRepository projectRepository,
                              UserService userService,
                              ApplicationEventPublisher publisher) {
        this.projectRepository = projectRepository;
        this.userService = userService;
        this.publisher = publisher;
    }

    @Override
    @Transactional
    public Project createProject(String name, UUID leaderId, UUID currentUserId) {
        // ✅ Only ADMIN can create projects
        User admin = userService.getById(currentUserId);
        if (admin.getRole() != Role.ADMIN) {
            throw new AccessDeniedException("Only admin can create projects");
        }

        User leader = userService.getById(leaderId);

        // ✅ Prevent ADMIN from being assigned as project leader
        if (leader.getRole() == Role.ADMIN) {
            throw new BusinessException("Admin users cannot be assigned as project leaders");
        }

        // ✅ Check if user is already leading 3 projects
        long currentProjectsLed = projectRepository.countProjectsLedByUser(leaderId);
        if (currentProjectsLed >= MAX_PROJECTS_LEAD) {
            throw new BusinessException(
                    String.format("User is already leading %d projects. Maximum allowed is %d.",
                            currentProjectsLed, MAX_PROJECTS_LEAD)
            );
        }

        Project project = new Project(name, leader);
        return projectRepository.save(project);
    }

    @Override
    @Transactional
    public void addMembers(UUID projectId, List<UUID> userIds, UUID currentUserId) {
        if (userIds == null || userIds.isEmpty()) {
            throw new BusinessException("At least one user ID is required");
        }

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        if (project.getStatus() != ProjectStatus.ACTIVE) {
            throw new BusinessException("Project is not active");
        }

        // ✅ CHANGED: Only ADMIN can add members (removed PROJECT_LEADER access)
        User currentUser = userService.getById(currentUserId);
        if (currentUser.getRole() != Role.ADMIN) {
            throw new AccessDeniedException("Only ADMIN can add members to projects");
        }

        List<String> addedUsers = new ArrayList<>();
        for (UUID userId : userIds) {
            try {
                User userToAdd = userService.getById(userId);

                // ✅ Prevent ADMIN from being added as member
                if (userToAdd.getRole() == Role.ADMIN) {
                    logger.warn("Cannot add ADMIN user {} to project", userToAdd.getEmail());
                    continue;
                }

                if (project.getMembers().contains(userToAdd)) {
                    logger.info("User {} is already a member of project {}", userToAdd.getEmail(), project.getName());
                    continue;
                }

                project.addMember(userToAdd);
                addedUsers.add(userToAdd.getName());

            } catch (Exception e) {
                logger.error("Failed to add user {} to project: {}", userId, e.getMessage());
            }
        }

        if (addedUsers.isEmpty()) {
            throw new BusinessException("No users were added to the project");
        }

        projectRepository.save(project);

        // Publish event
        List<UUID> members = project.getMembers().stream()
                .map(User::getId)
                .toList();

        publisher.publishEvent(new ProjectMemberAddedEvent(
                project.getName(),
                String.join(", ", addedUsers),
                "members",
                members
        ));

        logger.info("Added {} users to project {} by {}", addedUsers.size(), project.getName(), currentUser.getEmail());
    }

    @Override
    @Transactional
    public void removeMember(UUID projectId, UUID userId, UUID currentUserId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        if (project.getStatus() != ProjectStatus.ACTIVE) {
            throw new BusinessException("Project is not active");
        }

        // ✅ CHANGED: Only ADMIN can remove members (removed PROJECT_LEADER access)
        User currentUser = userService.getById(currentUserId);
        if (currentUser.getRole() != Role.ADMIN) {
            throw new AccessDeniedException("Only ADMIN can remove members from projects");
        }

        User userToRemove = userService.getById(userId);

        // ❌ Cannot remove project leader
        if (userToRemove.equals(project.getLeader())) {
            throw new BusinessException("Cannot remove project leader");
        }

        project.removeMember(userToRemove);
        projectRepository.save(project);

        logger.info("User {} removed from project {} by {}", userToRemove.getEmail(), project.getName(), currentUser.getEmail());
    }

    @Override
    public Project getById(UUID projectId) {
        return projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));
    }

    @Override
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    @Override
    public List<Project> getProjectsByMemberId(UUID userId) {
        return projectRepository.findProjectsByMemberId(userId);
    }

    @Override
    public List<Project> getProjectsLeadByUser(UUID userId) {
        return projectRepository.findProjectsByLeaderId(userId);
    }

    @Override
    @Transactional
    public Project updateProjectLeader(UUID projectId, UUID leaderId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        User newLeader = userService.getById(leaderId);

        // ✅ Prevent ADMIN from being assigned as project leader
        if (newLeader.getRole() == Role.ADMIN) {
            throw new BusinessException("Admin users cannot be assigned as project leaders");
        }

        // ✅ Check if user is already leading 3 projects
        long currentProjectsLed = projectRepository.countProjectsLedByUser(leaderId);
        if (currentProjectsLed >= MAX_PROJECTS_LEAD) {
            throw new BusinessException(
                    String.format("User is already leading %d projects. Maximum allowed is %d.",
                            currentProjectsLed, MAX_PROJECTS_LEAD)
            );
        }

        User oldLeader = project.getLeader();
        project.setLeader(newLeader);

        // ✅ Ensure new leader is in members list
        if (!project.getMembers().contains(newLeader)) {
            project.addMember(newLeader);
        }

        Project updatedProject = projectRepository.save(project);
        logger.info("Project leader updated for project {} from {} to {}",
                project.getName(),
                oldLeader != null ? oldLeader.getEmail() : "none",
                newLeader.getEmail()
        );

        return updatedProject;
    }

    @Override
    @Transactional
    public void promoteToLeader(UUID projectId, UUID userId, UUID currentUserId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        User currentUser = userService.getById(currentUserId);

        // ✅ CHANGED: Only ADMIN can promote members to leader (removed PROJECT_LEADER access)
        if (currentUser.getRole() != Role.ADMIN) {
            throw new AccessDeniedException("Only ADMIN can promote members to project leader");
        }

        User userToPromote = userService.getById(userId);

        // ✅ Prevent ADMIN from being promoted to leader
        if (userToPromote.getRole() == Role.ADMIN) {
            throw new BusinessException("Admin users cannot be promoted to project leader");
        }

        // Check if user is a member
        if (!project.getMembers().contains(userToPromote)) {
            throw new BusinessException("User is not a member of this project");
        }

        // ✅ Check if user is already leading 3 projects
        long currentProjectsLed = projectRepository.countProjectsLedByUser(userId);
        if (currentProjectsLed >= MAX_PROJECTS_LEAD) {
            throw new BusinessException(
                    String.format("User is already leading %d projects. Maximum allowed is %d.",
                            currentProjectsLed, MAX_PROJECTS_LEAD)
            );
        }

        User oldLeader = project.getLeader();
        project.setLeader(userToPromote);

        projectRepository.save(project);
        logger.info("User {} promoted to leader of project {} by {}",
                userToPromote.getEmail(), project.getName(), currentUser.getEmail());
    }

    @Override
    @Transactional
    public void demoteFromLeader(UUID projectId, UUID userId, UUID currentUserId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        User currentUser = userService.getById(currentUserId);

        // Only ADMIN can demote
        if (currentUser.getRole() != Role.ADMIN) {
            throw new AccessDeniedException("Only ADMIN can demote project leaders");
        }

        User userToDemote = userService.getById(userId);

        // Check if user is the leader
        if (!userToDemote.equals(project.getLeader())) {
            throw new BusinessException("User is not the leader of this project");
        }

        project.setLeader(null);

        projectRepository.save(project);
        logger.info("User {} demoted from leader of project {} by {}",
                userToDemote.getEmail(), project.getName(), currentUser.getEmail());
    }

    @Override
    public void validateProjectAccess(UUID projectId, UUID userId) {
        Project project = getById(projectId);
        User user = userService.getById(userId);

        // ✅ ADMIN can access any project
        if (user.getRole() == Role.ADMIN) {
            return;
        }

        // ✅ Check if user is the project leader
        if (project.getLeader() != null && project.getLeader().getId().equals(userId)) {
            return;
        }

        // ✅ Check if user is a team member
        boolean isMember = project.getMembers().stream()
                .anyMatch(m -> m.getId().equals(userId));

        if (isMember) {
            return;
        }

        throw new AccessDeniedException("You are not authorized to view this project");
    }

    // ❌ REMOVED: authorize() method - no longer needed
}