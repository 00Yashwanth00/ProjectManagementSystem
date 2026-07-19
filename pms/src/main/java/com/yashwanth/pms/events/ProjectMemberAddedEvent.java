package com.yashwanth.pms.events;

import java.util.List;
import java.util.UUID;

public class ProjectMemberAddedEvent {

    private final String projectName;
    private final String memberName;
    private final List<UUID> members;  // ✅ List of user IDs to notify

    // ✅ Constructor with 3 parameters
    public ProjectMemberAddedEvent(String projectName, String memberName, List<UUID> members) {
        this.projectName = projectName;
        this.memberName = memberName;
        this.members = members;
    }

    public String getProjectName() { return projectName; }
    public String getMemberName() { return memberName; }
    public List<UUID> getMembers() { return members; }
}