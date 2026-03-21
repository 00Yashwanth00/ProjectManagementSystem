package com.yashwanth.pms.events;

import java.util.List;
import java.util.UUID;

public class ProjectMemberAddedEvent {


    private final String projectName;
    private final String memberName;
    private final String email;
    private final List<UUID> members;

    public ProjectMemberAddedEvent(String projectName, String memberName, String email, List<UUID> members) {
        this.projectName = projectName;
        this.memberName = memberName;
        this.email = email;
        this.members = members;
    }

    public String getProjectName() {
        return projectName;
    }

    public String getMemberName() {
        return memberName;
    }

    public String getEmail() {
        return email;
    }

    public List<UUID> getMembers() {
        return members;
    }
}
