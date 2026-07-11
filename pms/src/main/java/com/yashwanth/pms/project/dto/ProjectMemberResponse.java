package com.yashwanth.pms.project.dto;

import com.yashwanth.pms.user.dto.UserResponse;

/**
 * Represents a project member for API responses, paired with the role they
 * currently hold WITHIN THIS PROJECT ("PROJECT_LEADER" or "TEAM_MEMBER").
 *
 * This role is computed fresh every time from Project.getMemberRole(user) —
 * it is never read from or written to the database.
 */
public class ProjectMemberResponse {

    private UserResponse user;
    private String projectRole;

    public static ProjectMemberResponse from(UserResponse user, String projectRole) {
        ProjectMemberResponse response = new ProjectMemberResponse();
        response.user = user;
        response.projectRole = projectRole;
        return response;
    }

    public UserResponse getUser() { return user; }
    public void setUser(UserResponse user) { this.user = user; }
    public String getProjectRole() { return projectRole; }
    public void setProjectRole(String projectRole) { this.projectRole = projectRole; }
}
