package com.yashwanth.pms.project.domain;

import com.yashwanth.pms.user.domain.User;
import jakarta.persistence.*;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "projects")
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProjectStatus status;

    @ManyToOne
    @JoinColumn(name = "leader_id")
    private User leader;

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ProjectMember> projectMembers = new HashSet<>();

    protected Project() {}

    public Project(String name, User leader) {
        this.name = name;
        this.leader = leader;
        this.status = ProjectStatus.ACTIVE;
    }

    // ✅ Business methods for managing members with roles
    public void addMember(User user, ProjectMemberRole role) {
        // Remove existing member entry if exists
        removeMember(user);

        ProjectMember member = new ProjectMember(this, user, role);
        this.projectMembers.add(member);

        // If adding as PROJECT_LEADER, update the leader field
        if (role == ProjectMemberRole.PROJECT_LEADER) {
            this.leader = user;
        }
    }

    public void removeMember(User user) {
        this.projectMembers.removeIf(pm -> pm.getUser().equals(user));

        // If removing the leader, clear leader field
        if (this.leader != null && this.leader.equals(user)) {
            this.leader = null;
        }
    }

    public void updateMemberRole(User user, ProjectMemberRole newRole) {
        ProjectMember member = projectMembers.stream()
                .filter(pm -> pm.getUser().equals(user))
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("User is not a member of this project"));

        // If changing to PROJECT_LEADER, demote existing leader
        if (newRole == ProjectMemberRole.PROJECT_LEADER) {
            // Demote current leader to TEAM_MEMBER
            projectMembers.stream()
                    .filter(pm -> pm.getRole() == ProjectMemberRole.PROJECT_LEADER)
                    .forEach(pm -> pm.setRole(ProjectMemberRole.TEAM_MEMBER));

            this.leader = user;
        } else if (member.getRole() == ProjectMemberRole.PROJECT_LEADER &&
                newRole == ProjectMemberRole.TEAM_MEMBER) {
            // If demoting leader, clear leader field
            this.leader = null;
        }

        member.setRole(newRole);
    }

    public ProjectMemberRole getMemberRole(User user) {
        return projectMembers.stream()
                .filter(pm -> pm.getUser().equals(user))
                .map(ProjectMember::getRole)
                .findFirst()
                .orElse(null);
    }

    public boolean isLeader(User user) {
        return this.leader != null && this.leader.equals(user);
    }

    public boolean isMember(User user) {
        return projectMembers.stream().anyMatch(pm -> pm.getUser().equals(user));
    }

    public Set<User> getMembers() {
        Set<User> users = new HashSet<>();
        for (ProjectMember pm : projectMembers) {
            users.add(pm.getUser());
        }
        return users;
    }

    public Set<ProjectMember> getProjectMembers() {
        return projectMembers;
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public String getName() { return name; }
    public ProjectStatus getStatus() { return status; }
    public void setStatus(ProjectStatus status) { this.status = status; }
    public User getLeader() { return leader; }
    public void setLeader(User leader) { this.leader = leader; }
}