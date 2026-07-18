package com.yashwanth.pms.project.service;

import com.yashwanth.pms.common.exception.AccessDeniedException;
import com.yashwanth.pms.common.exception.BusinessException;
import com.yashwanth.pms.common.exception.ResourceNotFoundException;
import com.yashwanth.pms.events.ProjectMemberAddedEvent;
import com.yashwanth.pms.project.domain.Project;
import com.yashwanth.pms.project.domain.ProjectMember;
import com.yashwanth.pms.project.domain.ProjectMemberRole;
import com.yashwanth.pms.project.domain.ProjectStatus;
import com.yashwanth.pms.project.repository.ProjectMemberRepository;
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
import java.util.stream.Collectors;

@Service
public class ProjectServiceImpl implements ProjectService {

    private static final Logger logger = LoggerFactory.getLogger(ProjectServiceImpl.class);
    private static final int MAX_PROJECTS_LEAD = 3;

    private final ProjectRepository projectRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final UserService userService;
    private final ApplicationEventPublisher publisher;

    public ProjectServiceImpl(ProjectRepository projectRepository,
                              ProjectMemberRepository projectMemberRepository,
                              UserService userService,
                              ApplicationEventPublisher publisher) {
        this.projectRepository = projectRepository;
        this.projectMemberRepository = projectMemberRepository;
        this.userService = userService;
        this.publisher = publisher;
    }

    @Override
    @Transactional
    public Project createProject(String name, UUID leaderId, UUID currentUserId) {
        User admin = userService.getById(currentUserId);
        if (admin.getRole() != Role.ADMIN) {
            throw new AccessDeniedException("Only admin can create projects");
        }

        User leader = userService.getById(leaderId);

        if (leader.getRole() == Role.ADMIN) {
            throw new BusinessException("Admin users cannot be assigned as project leaders");
        }

        long currentProjectsLed = projectRepository.countProjectsLedByUser(leaderId);
        if (currentProjectsLed >= MAX_PROJECTS_LEAD) {
            throw new BusinessException(
                    String.format("User is already leading %d projects. Maximum allowed is %d.",
                            currentProjectsLed, MAX_PROJECTS_LEAD)
            );
        }

        Project project = new Project(name, leader);
        project = projectRepository.save(project);

        // ✅ Add leader as PROJECT_LEADER in project_members
        project.addMember(leader, ProjectMemberRole.PROJECT_LEADER);
        project = projectRepository.save(project);

        return project;
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

        User currentUser = userService.getById(currentUserId);
        if (currentUser.getRole() != Role.ADMIN) {
            throw new AccessDeniedException("Only ADMIN can add members to projects");
        }

        List<String> addedUsers = new ArrayList<>();
        for (UUID userId : userIds) {
            try {
                User userToAdd = userService.getById(userId);

                if (userToAdd.getRole() == Role.ADMIN) {
                    logger.warn("Cannot add ADMIN user {} to project", userToAdd.getEmail());
                    continue;
                }

                if (project.isMember(userToAdd)) {
                    logger.info("User {} is already a member of project {}", userToAdd.getEmail(), project.getName());
                    continue;
                }

                // ✅ Add as TEAM_MEMBER by default
                project.addMember(userToAdd, ProjectMemberRole.TEAM_MEMBER);
                addedUsers.add(userToAdd.getName());

            } catch (Exception e) {
                logger.error("Failed to add user {} to project: {}", userId, e.getMessage());
            }
        }

        if (addedUsers.isEmpty()) {
            throw new BusinessException("No users were added to the project");
        }

        projectRepository.save(project);

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

        User currentUser = userService.getById(currentUserId);
        if (currentUser.getRole() != Role.ADMIN) {
            throw new AccessDeniedException("Only ADMIN can remove members from projects");
        }

        User userToRemove = userService.getById(userId);

        // ✅ Check if user is PROJECT_LEADER
        ProjectMemberRole role = project.getMemberRole(userToRemove);
        if (role == ProjectMemberRole.PROJECT_LEADER) {
            throw new BusinessException("Cannot remove project leader. Demote the leader first.");
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

        if (newLeader.getRole() == Role.ADMIN) {
            throw new BusinessException("Admin users cannot be assigned as project leaders");
        }

        long currentProjectsLed = projectRepository.countProjectsLedByUser(leaderId);
        if (currentProjectsLed >= MAX_PROJECTS_LEAD) {
            throw new BusinessException(
                    String.format("User is already leading %d projects. Maximum allowed is %d.",
                            currentProjectsLed, MAX_PROJECTS_LEAD)
            );
        }

        // ✅ Demote current leader to TEAM_MEMBER, promote new leader
        project.updateMemberRole(newLeader, ProjectMemberRole.PROJECT_LEADER);

        Project updatedProject = projectRepository.save(project);
        logger.info("Project leader updated for project {} to {}",
                project.getName(), newLeader.getEmail());

        return updatedProject;
    }

    @Override
    @Transactional
    public void promoteToLeader(UUID projectId, UUID userId, UUID currentUserId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        User currentUser = userService.getById(currentUserId);

        if (currentUser.getRole() != Role.ADMIN) {
            throw new AccessDeniedException("Only ADMIN can promote members to project leader");
        }

        User userToPromote = userService.getById(userId);

        if (userToPromote.getRole() == Role.ADMIN) {
            throw new BusinessException("Admin users cannot be promoted to project leader");
        }

        if (!project.isMember(userToPromote)) {
            throw new BusinessException("User is not a member of this project");
        }

        long currentProjectsLed = projectRepository.countProjectsLedByUser(userId);
        if (currentProjectsLed >= MAX_PROJECTS_LEAD) {
            throw new BusinessException(
                    String.format("User is already leading %d projects. Maximum allowed is %d.",
                            currentProjectsLed, MAX_PROJECTS_LEAD)
            );
        }

        // ✅ Promote to PROJECT_LEADER (demotes current leader automatically)
        project.updateMemberRole(userToPromote, ProjectMemberRole.PROJECT_LEADER);

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

        if (currentUser.getRole() != Role.ADMIN) {
            throw new AccessDeniedException("Only ADMIN can demote project leaders");
        }

        User userToDemote = userService.getById(userId);

        ProjectMemberRole role = project.getMemberRole(userToDemote);
        if (role != ProjectMemberRole.PROJECT_LEADER) {
            throw new BusinessException("User is not the leader of this project");
        }

        // ✅ Demote to TEAM_MEMBER
        project.updateMemberRole(userToDemote, ProjectMemberRole.TEAM_MEMBER);

        projectRepository.save(project);
        logger.info("User {} demoted from leader of project {} by {}",
                userToDemote.getEmail(), project.getName(), currentUser.getEmail());
    }

    @Override
    public void validateProjectAccess(UUID projectId, UUID userId) {
        Project project = getById(projectId);
        User user = userService.getById(userId);

        if (user.getRole() == Role.ADMIN) {
            return;
        }

        if (project.isLeader(user) || project.isMember(user)) {
            return;
        }

        throw new AccessDeniedException("You are not authorized to view this project");
    }

    @Override
    public List<User> getProjectMembers(UUID projectId) {
        Project project = getById(projectId);
        return project.getProjectMembers().stream()
                .map(ProjectMember::getUser)
                .collect(Collectors.toList());
    }
}