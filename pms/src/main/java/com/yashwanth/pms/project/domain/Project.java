package com.yashwanth.pms.project.domain;

import com.yashwanth.pms.project.domain.ProjectStatus;
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

    @ManyToOne(optional = false)
    @JoinColumn(name = "leader_id")
    private User leader;

    @ManyToMany
    @JoinTable(
            name = "project_members",
            joinColumns = @JoinColumn(name = "project_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> members = new HashSet<>();

    protected Project() {
        // JPA
    }

    public Project(String name, User leader) {
        this.name = name;
        this.leader = leader;
        this.status = ProjectStatus.ACTIVE;
        this.members.add(leader);
    }

    public UUID getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public ProjectStatus getStatus() {
        return status;
    }

    public User getLeader() {
        return leader;
    }

    public Set<User> getMembers() {
        return members;
    }
}
