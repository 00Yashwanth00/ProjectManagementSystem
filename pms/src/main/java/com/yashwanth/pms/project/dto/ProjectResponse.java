package com.yashwanth.pms.project.dto;

import com.yashwanth.pms.project.domain.Project;
import com.yashwanth.pms.user.dto.UserResponse;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

public class ProjectResponse {
    private String id;
    private String name;
    private String status;
    private UserResponse leader;
    private List<ProjectMemberResponse> members;
    private int memberCount;

    public static ProjectResponse from(Project project) {
        ProjectResponse response = new ProjectResponse();
        response.setId(project.getId().toString());
        response.setName(project.getName());
        response.setStatus(project.getStatus().name());

        if (project.getLeader() != null) {
            response.setLeader(UserResponse.from(project.getLeader()));
        }

        if (project.getMembers() != null && !project.getMembers().isEmpty()) {
            List<ProjectMemberResponse> memberResponses = project.getMembers().stream()
                    .map(member -> ProjectMemberResponse.from(
                            UserResponse.from(member),
                            project.getMemberRole(member)
                    ))
                    .collect(Collectors.toList());

            // ✅ Sort: Project Leader first, then Team Members alphabetically
            memberResponses.sort((a, b) -> {
                // Project Leader comes first
                if ("PROJECT_LEADER".equals(a.getProjectRole()) && !"PROJECT_LEADER".equals(b.getProjectRole())) {
                    return -1;
                }
                if (!"PROJECT_LEADER".equals(a.getProjectRole()) && "PROJECT_LEADER".equals(b.getProjectRole())) {
                    return 1;
                }
                // If both are same role, sort by name
                return a.getUser().getName().compareToIgnoreCase(b.getUser().getName());
            });

            response.setMembers(memberResponses);
            response.setMemberCount(project.getMembers().size());
        }

        return response;
    }

    // Getters and setters...
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public UserResponse getLeader() { return leader; }
    public void setLeader(UserResponse leader) { this.leader = leader; }
    public List<ProjectMemberResponse> getMembers() { return members; }
    public void setMembers(List<ProjectMemberResponse> members) { this.members = members; }
    public int getMemberCount() { return memberCount; }
    public void setMemberCount(int memberCount) { this.memberCount = memberCount; }
}