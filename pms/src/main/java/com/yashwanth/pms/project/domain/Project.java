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

    @ManyToMany
    @JoinTable(
            name = "project_members",
            joinColumns = @JoinColumn(name = "project_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> members = new HashSet<>();

    // ❌ Removed: memberRoles map / project_member_roles table.
    // Project-level role (PROJECT_LEADER vs TEAM_MEMBER) is NOT persisted.
    // It is derived on read by comparing a member against `leader` — see getMemberRole().

    protected Project() {}

    public Project(String name, User leader) {
        this.name = name;
        this.leader = leader;
        this.status = ProjectStatus.ACTIVE;
        this.members.add(leader);
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public String getName() { return name; }
    public ProjectStatus getStatus() { return status; }
    public void setStatus(ProjectStatus status) { this.status = status; }
    public User getLeader() { return leader; }
    public void setLeader(User leader) { this.leader = leader; }
    public Set<User> getMembers() { return members; }

    // Business methods
    public void addMember(User user) {
        this.members.add(user);
    }

    public void removeMember(User user) {
        this.members.remove(user);
    }

    /**
     * Derives this user's role WITHIN THIS PROJECT.
     * Not stored anywhere — purely a function of (leader, members) at read time.
     * A user is only ever "PROJECT_LEADER" while they equal project.leader;
     * the moment the leader changes, the old leader is automatically "TEAM_MEMBER"
     * again with no write required.
     */
    public String getMemberRole(User user) {
        if (user == null) return "NONE";
        if (isLeader(user)) return "PROJECT_LEADER";
        if (isMember(user)) return "TEAM_MEMBER";
        return "NONE";
    }

    public boolean isLeader(User user) {
        if (user == null || leader == null) return false;
        return leader.getId().equals(user.getId());
    }

    public boolean isMember(User user) {
        if (user == null) return false;
        return members.contains(user);
    }
}
