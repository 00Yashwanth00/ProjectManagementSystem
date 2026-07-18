package com.yashwanth.pms.project.domain;

import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

public class ProjectMemberId implements Serializable {

    private UUID project;
    private UUID user;

    public ProjectMemberId() {}

    public ProjectMemberId(UUID project, UUID user) {
        this.project = project;
        this.user = user;
    }

    public UUID getProject() { return project; }
    public void setProject(UUID project) { this.project = project; }
    public UUID getUser() { return user; }
    public void setUser(UUID user) { this.user = user; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ProjectMemberId)) return false;
        ProjectMemberId that = (ProjectMemberId) o;
        return Objects.equals(project, that.project) &&
                Objects.equals(user, that.user);
    }

    @Override
    public int hashCode() {
        return Objects.hash(project, user);
    }
}